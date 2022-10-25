import PropTypes from 'prop-types';

import classNames from 'classnames';
import findIndex from 'lodash/findIndex';
import styled from 'styled-components';
import {DateTime} from 'luxon';
import produce from 'immer';

import Button from '@ui/Button';
import Card from '@ui/Card';
import ConfidenceScoreLabel from '@ui/ConfidenceScoreLabel';
import ReviewToggle from '@document/ReviewToggle';
import Tooltip from '@ui/Tooltip';
import {AnnotationStatus} from '@utils/constants';
import {rightSidebarState, useAnnotations, useDocument} from '@document';
import {colors} from '@ui/theme';
import {nowISOTime, datetimeToHuman} from '@utils/transformers';
import {updateAnnotation} from '@document/api';
import {useUser} from '@user';

import typeStyles from '@styles/TypeStyles';
import {statusStyles} from '@styles/AnnotationStyles';
import {ReactComponent as HorizontalSort} from '@assets/svgs/Horizontal_Sort.svg';
import {ReactComponent as TrashCan} from '@assets/svgs/TrashCan.svg';

//Left border span color based on annotation status.
//Pulls colors from theme.js file
export const StatusBorder = styled.span`
 background: ${({status}) =>
    status === AnnotationStatus.NOT_REVIEWED
      ? 'transparent'
      : status === AnnotationStatus.ACCEPTED
        ? colors.green['400']
        : status === AnnotationStatus.REJECTED
          ? colors.red['600']
          : 'transparent'}
     
  transform: ${({status}) =>
    status !== AnnotationStatus.NOT_REVIEWED
      ? 'translateX(-8px)'
      : 'translateX(0px)'};

transition: all 0.2s ease-in-out;
`;

const ActiveAnnotationCard = (props) => {
  const {
    // text,
    entity_p,
    tag,
    id,
    status,
    canonical_name,
    canonical_id,
    score_cat,
    datetime_modified,
    // datetime_created,
    className
  } = props;

  const {data: user} = useUser();
  const {activeAnnotation} = rightSidebarState.useValue();
  const {data: annotations, mutate: mutateAnnotations} = useAnnotations();
  const {data: document, mutate: mutateDocument} = useDocument();

  if (status === AnnotationStatus.MANUAL) {
    return (
      <Card className={`mb-2.5 relative overflow-hidden mt-7 ${className}`}>
        <span
          className="h-full left-0 top-0 absolute bg-holofoil_blue"
          style={{width: '6px'}}></span>
        <div
          className={`font-sans font-bold mb-2 text-${typeStyles[tag]['textColor']}`}>
          {canonical_name}
        </div>
        <div className="flex justify-between flex-col">
          <div className="flex flex-row mb-2">
            <Tooltip
              content={typeStyles[tag]['label']}
              arrow={false}
              followCursor={true}
              size="small">
              {typeStyles[tag]['icon']}
            </Tooltip>
            <Tooltip
              content={canonical_name}
              arrow={false}
              followCursor={true}
              size="small">
              <span className="block ml-2 text-grey-500 underline font-normal font-mono text-sm">
                {canonical_id}
              </span>
            </Tooltip>
          </div>
          <p className="text-xs text-grey-300 mb-2">
            Last Edited on{' '}
            {datetimeToHuman(datetime_modified, DateTime.DATE_FULL)}
          </p>
          <div className="flex flex-row items-center justify-start">
            <Button tertiaryIcon className="w-8 h-8 mr-2">
              <Tooltip
                content={'Change Linked Concept'}
                size={'small'}
                placement="bottom">
                <HorizontalSort className="text-grey-500" />
              </Tooltip>
            </Button>
            <Button tertiaryIcon className="w-8 h-8">
              <Tooltip
                content={'Delete Annotation'}
                size={'small'}
                placement="bottom">
                <TrashCan className="text-grey-500" />
              </Tooltip>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const reviewAnnotation = async (newStatus) => {
    //Check if new status is the same as our current status.
    //If it is set the new status to NOT_REVIEW
    const _newStatus =
      newStatus === status
        ? AnnotationStatus.NOT_REVIEWED
        : AnnotationStatus[newStatus];

    //Find the index of this annotation in the documents annotation.
    const annotationIndex = findIndex(annotations, (o) => o.id === id);

    //NOTE(Rejon): Remove the annotation we're updating from preflight,
    //             so we can attach a preFlight annotation during mutation.
    let preFlightAnnotations = [...annotations];

    //Set up our preFlight annotation
    const preFlightAnnotation = {
      ...props,
      node: null,
      datetime_reviewed: nowISOTime(),
      status: _newStatus
    };

    //Set up our preFlight aggregations
    let preflightProgressCount = document.aggregations.progress.count; //Store the count, we're going to edit it

    const indexOfOldStatus = findIndex(
      //Find the index in our aggregations of the old status
      document.aggregations.progress.status,
      (o) => o === status
    );

    const indexOfNewStatus = findIndex(
      //Find the index in our aggregations of the new status
      document.aggregations.progress.status,
      (o) => o === _newStatus
    );

    //Subtract 1 from the old status, Add 1 to the new status
    preflightProgressCount[indexOfOldStatus] =
      preflightProgressCount[indexOfOldStatus] - 1;

    preflightProgressCount[indexOfNewStatus] =
      preflightProgressCount[indexOfNewStatus] + 1;

    //Set up preFlight aggregation object
    const preFlightAggregation = {
      ...document.aggregations,
      progress: {
        count: preflightProgressCount,
        ...document.aggregations.progress
      }
    };

    //Update our preFlightAnnotations annotation at the specific index.
    //NOTE(Rejon): I put preFlight: true here instead of the object above,
    //             because we want to avoid updating activeAnnotationState twice
    //             when preFlight is automatically removed by swr refresh.
    preFlightAnnotations[annotationIndex] = {
      ...preFlightAnnotation,
      preFlight: true
    };

    //If this annotation is the active annotation, update with the new data.
    if (activeAnnotation.id === id) {
      rightSidebarState.set((prev) =>
        produce(prev, (updated) => {
          updated.activeAnnotation = preFlightAnnotation;
        })
      );
    }

    //Optimistically update the UI immediately
    mutateDocument(
      {
        ...document,
        aggregations: preFlightAggregation,
        annotations: preFlightAnnotations
      },
      false
    );

    //Mutate annotations in-case of filtering immediately.
    //NOTE(Rejon): When filtering a seperate SWR hook is used for the query.
    //             So this is necessary to avoid the document not updating annotations when filtering.
    mutateAnnotations(preFlightAnnotations, false);

    //Update our annotations on the backend.
    const {annotations: newAnnotations, aggregations} = await updateAnnotation(
      user.id,
      user.accessToken,
      document.id,
      [preFlightAnnotation]
    );

    //Remove preflight from the annotation in the annotations array.
    preFlightAnnotations[annotationIndex] = newAnnotations[0];

    //Update our UI with new real data, revalidate endpoint.
    mutateDocument({
      ...document,
      annotations: preFlightAnnotations,
      aggregations
    });

    //Mutate annotations in-case of filtering with true data.
    //NOTE(Rejon): When filtering a seperate SWR hook is used for the query.
    //             So this is necessary to avoid the document not updating annotations when filtering.
    mutateAnnotations(preFlightAnnotations);
  };

  //use classnames for animation pulse
  const pulseClass = classNames({
    'animate-redpulse': status === AnnotationStatus.REJECTED,
    'animate-greenpulse': status === AnnotationStatus.ACCEPTED
  });

  return (
    <Card
      className={`mb-2.5 relative overflow-hidden mt-7 ${className} ${pulseClass}`}>
      <StatusBorder
        status={status}
        className={`status-border absolute h-full left-0 top-0 ${statusStyles[status].bg}`}
        style={{width: '6px'}}></StatusBorder>
      <ReviewToggle
        className="mb-3"
        status={status}
        reviewAnnotation={reviewAnnotation}
      />
      <div
        className={`font-sans font-bold mb-2 text-${typeStyles[tag]['textColor']}`}>
        {canonical_name}
      </div>
      <div className="flex justify-between">
        <div className="flex flex-row">
          <Tooltip
            content={typeStyles[tag]['label']}
            arrow={false}
            followCursor={true}
            size="small">
            {typeStyles[tag]['icon']}
          </Tooltip>
          <Tooltip
            content={canonical_name}
            arrow={false}
            followCursor={true}
            size="small">
            <span className="block ml-2 text-grey-500 underline font-normal font-mono text-sm">
              {canonical_id}
            </span>
          </Tooltip>
        </div>
        <ConfidenceScoreLabel type={score_cat} score={entity_p} />
      </div>
    </Card>
  );
};

ActiveAnnotationCard.propTypes = {
  // Annotation text displayed
  text: PropTypes.string.isRequired,
  //Unique ID for the annotation
  id: PropTypes.string,
  //Kepler model confidence score
  entity_p: PropTypes.number,
  //Tag type of the annotation
  tag: PropTypes.string.isRequired,
  //Review status of the annotation (See AnnotationStatus in constants.js)
  status: PropTypes.string.isRequired,
  //Canonical name of the annotation
  canonical_name: PropTypes.string,
  //Canonical ID of the annotation
  canonical_id: PropTypes.string,
  //Last datetime of the annotation being modified
  datetime_modified: PropTypes.string,
  //datetime of the annotation's creation
  datetime_created: PropTypes.string,
  //Constant all caps string of the confidence score category
  score_cat: PropTypes.string,
  // Tailwind Classes
  className: PropTypes.string
};

export default ActiveAnnotationCard;
