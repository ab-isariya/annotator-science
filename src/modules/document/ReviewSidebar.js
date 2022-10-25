import {useEffect, useRef} from 'react';

import clamp from 'lodash/clamp';
import findIndex from 'lodash/findIndex';
import sortBy from 'lodash/sortBy';
import {DateTime} from 'luxon';
import produce from 'immer';

import Button from '@ui/Button';
import Card from '@ui/Card';
import ConfidenceScoreLabel from '@ui/ConfidenceScoreLabel';
import Tooltip from '@ui/Tooltip';
import {
  AnnotationStatus,
  SNIPPET_CLAMP,
  RightSidebarModes
} from '@utils/constants';
import {nFormatter, nowISOTime, datetimeToHuman} from '@utils/transformers';
import {
  rightSidebarState,
  ReviewToggle,
  Snippet,
  useDocument,
  useAnnotations
} from '@document';
import {updateAnnotation} from '@document/api';
import {useUser} from '@user';

import {ReactComponent as Edit} from '@assets/svgs/Edit.svg';
import {ReactComponent as Close} from '@assets/svgs/Close.svg';
import {ReactComponent as TrashCan} from '@assets/svgs/TrashCan.svg';
import typeStyles from '@styles/TypeStyles';

const ReviewSidebar = () => {
  const annotationList = useRef(); //Scrolling annotation list ref for moving the scroll position.
  const {activeAnnotation, currentMode} = rightSidebarState.useValue();
  const {data: user} = useUser();
  const {data: _document, mutate: mutateDocument} = useDocument();
  const {data: annotations, mutate: mutateAnnotations} = useAnnotations();

  //Scroll to the active annotation on mount if this is active.
  useEffect(() => {
    if (annotationList.current && currentMode === RightSidebarModes.REVIEW) {
      annotationList.current.scroll({
        top:
          document.getElementById(
            `batch-review-annotation-${activeAnnotation.id}`
          ).offsetTop - 10,
        left: 0
      });
    }
  }, []);

  //Boolean for if every linked annotation has been approved.
  const allApproved =
    activeAnnotation?.linkedCanonicalAnnotations
      ?.filter((el) => el.status !== AnnotationStatus.MANUAL)
      .every((el) => el.status === AnnotationStatus.ACCEPTED) || false;

  //Boolean for if every linked annotation has been rejected.
  const allRejected =
    activeAnnotation?.linkedCanonicalAnnotations
      ?.filter((el) => el.status !== AnnotationStatus.MANUAL)
      .every((el) => el.status === AnnotationStatus.REJECTED) || false;

  //Review Status of all the annotations.
  const allStatus = allApproved
    ? AnnotationStatus.ACCEPTED
    : allRejected
      ? AnnotationStatus.REJECTED
      : AnnotationStatus.NOT_REVIEWED;

  //NOTE(Rejon): Take linkedCanonicalAnnotations and ensure they're sorted by "start"
  const annotationListElements = sortBy(
    activeAnnotation.linkedCanonicalAnnotations,
    [(o) => o.start]
  );

  //Close the batch mode menu.
  const onCloseBatchMode = () => {
    rightSidebarState.set((prev) =>
      produce(prev, (updated) => {
        updated.currentMode = null;
      })
    );
  };

  /**
   * Review ALL Annotations.
   * Tweaked algorithm of "onReviewAnnotation" except that this mutates multiple
   * preFlight annotations using the linkCanonicalAnnotations array.
   *
   * @param {String} newStatus - new AnnotationStatus constant
   */
  const onReviewAllAnnotation = async (newStatus) => {
    //Check if new status is the same as our current status.
    //If it is set the new status to NOT_REVIEW
    const _newStatus =
      newStatus === allStatus
        ? AnnotationStatus.NOT_REVIEWED
        : AnnotationStatus[newStatus];

    //NOTE(Rejon): Remove the annotation we're updating from preflight,
    //             so we can attach a preFlight annotation during mutation.
    let preFlightAnnotations = [...annotations];

    //Set up our preFlight linked annotations
    const preFlightLinkedAnnotations =
      activeAnnotation.linkedCanonicalAnnotations
        .filter((el) => el.status !== AnnotationStatus.MANUAL)
        .map((ann) => {
          const newAnnObj = {
            ...ann,
            datetime_reviewed: nowISOTime(),
            status: _newStatus
          };

          const annotationIndex = findIndex(
            preFlightAnnotations,
            (o) => o.id === ann.id
          );

          preFlightAnnotations[annotationIndex] = newAnnObj;

          return newAnnObj;
        });

    //Set up our preFlight aggregations
    let preflightProgressCount = _document.aggregations.progress.count; //Store the count, we're going to edit it

    const indexOfOldStatus = findIndex(
      //Find the index in our aggregations of the old status
      _document.aggregations.progress.status,
      (o) => o === status
    );

    const indexOfNewStatus = findIndex(
      //Find the index in our aggregations of the new status
      _document.aggregations.progress.status,
      (o) => o === _newStatus
    );

    //Subtract 1 from the old status, Add 1 to the new status
    preflightProgressCount[indexOfOldStatus] =
      preflightProgressCount[indexOfOldStatus] -
      preFlightLinkedAnnotations.length;

    preflightProgressCount[indexOfNewStatus] =
      preflightProgressCount[indexOfNewStatus] +
      preFlightLinkedAnnotations.length;

    //Set up preFlight aggregation object

    const preFlightAggregation = {
      ..._document.aggregations,
      progress: {
        count: preflightProgressCount,
        ..._document.aggregations.progress
      }
    };

    //Also update activate annotations
    //If this annotation is the active annotation, update with the new data.
    if (preFlightAnnotations.some((ann) => ann.id === activeAnnotation.id)) {
      rightSidebarState.set((prev) =>
        produce(prev, (updated) => {
          updated.activeAnnotation = {
            ...activeAnnotation,
            linkedCanonicalAnnotations:
              prev.activeAnnotation.linkedCanonicalAnnotations,
            status: newStatus
          };
        })
      );
    }

    mutateDocument(
      {
        ..._document,
        aggregations: preFlightAggregation,
        annotations: preFlightAnnotations
      },
      false
    );

    // //Mutate annotations in-case of filtering with true data.
    // //NOTE(Rejon): When filtering a seperate SWR hook is used for the query.
    // //             So this is necessary to avoid the document not updating annotations when filtering.
    mutateAnnotations(preFlightAnnotations, false);

    //NOTE(Rejon): See if I need to return all the annotations to the front end or not.
    //            I don't think I need to, but we'll see.
    await updateAnnotation(
      user.id,
      user.accessToken,
      _document.id,
      preFlightLinkedAnnotations
    );

    //Update our UI with new real data, revalidate endpoint.
    mutateDocument({
      ..._document,
      aggregations: preFlightAggregation,
      annotations: preFlightAnnotations
    });

    //Mutate annotations in-case of filtering with true data.
    //NOTE(Rejon): When filtering a seperate SWR hook is used for the query.
    //             So this is necessary to avoid the document not updating annotations when filtering.
    mutateAnnotations(preFlightAnnotations);
  };

  /**
   * Reviewing a single annotation.
   * NOTE(Rejon): Same code used from ActiveAnnotationCard, tweaked for new data context.
   *
   * @param {String} newStatus - status constant to be applied to annotation.
   * @param {Object} _annotation (status, id) - Annotation object to use for updating the status.
   */
  const onReviewAnnotation = async (newStatus, _annotation) => {
    const {status, id} = _annotation;
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
      ..._annotation,
      datetime_reviewed: nowISOTime(),
      status: _newStatus
    };

    //Set up our preFlight aggregations
    let preflightProgressCount = _document.aggregations.progress.count; //Store the count, we're going to edit it

    const indexOfOldStatus = findIndex(
      //Find the index in our aggregations of the old status
      _document.aggregations.progress.status,
      (o) => o === status
    );

    const indexOfNewStatus = findIndex(
      //Find the index in our aggregations of the new status
      _document.aggregations.progress.status,
      (o) => o === _newStatus
    );

    //Subtract 1 from the old status, Add 1 to the new status
    preflightProgressCount[indexOfOldStatus] =
      preflightProgressCount[indexOfOldStatus] - 1;

    preflightProgressCount[indexOfNewStatus] =
      preflightProgressCount[indexOfNewStatus] + 1;

    //Set up preFlight aggregation object
    const preFlightAggregation = {
      ..._document.aggregations,
      progress: {
        count: preflightProgressCount,
        ..._document.aggregations.progress
      }
    };

    //Update our preFlightAnnotations annotation at the specific index.
    //NOTE(Rejon): I put preFlight: true here instead of the object above,
    //             because we want to avoid updating activeAnnotationState twice
    //             when preFlight is automatically removed by swr refresh.
    preFlightAnnotations[annotationIndex] = {
      ...preFlightAnnotation
    };

    //Also update activate annotations
    //If this annotation is the active annotation, update with the new data.
    if (activeAnnotation.id === id) {
      const newAnnotationNode = document.getElementById(`annotation-${id}`);

      rightSidebarState.set((prev) =>
        produce(prev, (updated) => {
          updated.activeAnnotation = {
            ...preFlightAnnotation,
            linkedCanonicalAnnotations:
              prev.activeAnnotation.linkedCanonicalAnnotations,
            node: newAnnotationNode
          };
        })
      );
    }

    mutateDocument(
      {
        ..._document,
        aggregations: preFlightAggregation,
        annotations: preFlightAnnotations
      },
      false
    );

    //Mutate annotations in-case of filtering with true data.
    //NOTE(Rejon): When filtering a seperate SWR hook is used for the query.
    //             So this is necessary to avoid the document not updating annotations when filtering.
    mutateAnnotations(preFlightAnnotations, false);

    //Update our annotations on the backend.
    const {annotations: newAnnotations, aggregations} = await updateAnnotation(
      user.id,
      user.accessToken,
      _document.id,
      [preFlightAnnotation]
    );

    //Remove preflight from the annotation in the annotations array.
    preFlightAnnotations[annotationIndex] = newAnnotations[0];

    //Update our UI with new real data, revalidate endpoint.
    mutateDocument({
      ..._document,
      annotations: preFlightAnnotations,
      aggregations
    });

    //Mutate annotations in-case of filtering with true data.
    //NOTE(Rejon): When filtering a seperate SWR hook is used for the query.
    //             So this is necessary to avoid the document not updating annotations when filtering.
    mutateAnnotations(preFlightAnnotations);
  };

  /**
   * Set annotation as active, adding it to array of active annotations
   */
  const setActiveAnnotation = (annotation) => {
    const {id} = annotation;
    const node = document.getElementById(`annotation-${id}`);

    //Scroll the clicked annotation into view.
    window.scroll({
      top: node.offsetTop - 10,
      left: 0,
      behavior: 'smooth'
    });

    //Only update the active annotation if the clicked card is
    //not the active annotation in state.
    //NOTE(Rejon): Since annotations listed here share linked Canonical Annotations, just pass the array along.
    if (activeAnnotation.id !== id) {
      rightSidebarState.set((prev) =>
        produce(prev, (updated) => {
          updated.activeAnnotation = {
            ...annotation,
            linkedCanonicalAnnotations:
              prev.activeAnnotation.linkedCanonicalAnnotations,
            node
          };
        })
      );
    }
  };

  return (
    <div
      className="w-65 mt-7 flex flex-col"
      style={{maxHeight: 'calc(100vh - 1.75rem)'}}>
      <h2 className="font-inter font-light flex flex-row items-center text-xl mb-2">
        <Tooltip content={'Close'} placement="bottom">
          <Close
            className="mr-2.5 text-grey-500 cursor-pointer"
            onClick={onCloseBatchMode}
          />
        </Tooltip>
        All Instances
      </h2>
      <div className="rounded-lg bg-grey-50 p-2.5 mb-4">
        <div className="mb-2.5 flex flex-row justify-between items-center">
          <p className="text-sm font-inter font-light">Linked Concept</p>
          <Button tertiaryIcon className="w-8 h-8">
            <Tooltip
              content={'Change Linked Concept'}
              size={'small'}
              placement="bottom">
              <Edit className="text-grey-500" />
            </Tooltip>
          </Button>
        </div>
        <div className="rounded-lg bg-white border border-grey-100 p-4">
          <div
            className={`font-sans font-bold mb-2 text-${
              typeStyles[activeAnnotation.tag]['textColor']
            }`}>
            {activeAnnotation.canonical_name}
          </div>
          <div className="flex justify-between">
            <div className="flex flex-row">
              <Tooltip
                content={typeStyles[activeAnnotation.tag]['label']}
                arrow={false}
                followCursor={true}
                size="small">
                {typeStyles[activeAnnotation.tag]['icon']}
              </Tooltip>
              <Tooltip
                content={activeAnnotation.canonical_name}
                arrow={false}
                followCursor={true}
                size="small">
                <span className="block ml-2 text-grey-500 underline font-normal font-mono text-sm">
                  {activeAnnotation.canonical_id}
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center py-2 border-b border-grey-300">
        <p className="text-sm font-inter">
          <b>
            {nFormatter(activeAnnotation.linkedCanonicalAnnotations.length, 1)}
          </b>{' '}
          Annotations
        </p>
        <ReviewToggle
          all={true}
          status={allStatus}
          reviewAnnotation={onReviewAllAnnotation}
        />
      </div>
      <div
        id={'review-sidebar-list'}
        ref={annotationList}
        className="pt-4 px-2.5 overflow-auto relative flex-1"
        style={{maxHeight: 'calc(100vh - 290px)'}}>
        {annotationListElements.map((ann) => {
          //Snippet data used for Review Annotations.
          const snippet = {
            //Start snippet text, uses document text, then slices based on constant length.
            //NOTE(Rejon): We clamp it because we won't know if an annotation is the first starting characters or not.
            startText: _document.text.slice(
              clamp(ann.start - SNIPPET_CLAMP, 0, ann.start - SNIPPET_CLAMP),
              ann.start
            ),
            //Boolean for if we should show the truncation dots or not.
            //NOTE(Rejon): We use a boolean for this check to see if the chopped off text ends at the beginning of the document.
            truncateStart: ann.start - SNIPPET_CLAMP > 0,
            endText: _document.text.slice(
              ann.end,
              clamp(ann.end + 25, ann.end, _document.text.length)
            ),
            truncateEnd: ann.end + SNIPPET_CLAMP < _document.text.length,
            snippet: ann.text //Snippet highlighted annotation text.
          };

          if (ann.status === AnnotationStatus.MANUAL) {
            return (
              <Card
                hover
                id={`batch-review-annotation-${ann.id}`}
                active={ann.id === activeAnnotation.id}
                className="cursor-pointer mb-2.5 relative overflow-hidden"
                onClick={() => setActiveAnnotation(ann)}
                key={`batch-review-ann-${ann.id}`}>
                <span
                  className="h-full left-0 top-0 absolute bg-holofoil_blue"
                  style={{width: '6px'}}></span>

                <Snippet
                  {...snippet}
                  className=" font-sans text-red-500 font-bold"
                />
                <p className="text-xs text-grey-300 mb-2 mt-2">
                  Last Edited on{' '}
                  {datetimeToHuman(ann.datetime_modified, DateTime.DATE_FULL)}
                </p>
                <Button tertiaryIcon className="w-8 h-8">
                  <Tooltip
                    content={'Delete Annotation'}
                    size={'small'}
                    placement="bottom">
                    <TrashCan className="text-grey-500" />
                  </Tooltip>
                </Button>
              </Card>
            );
          }

          return (
            <Card
              hover
              id={`batch-review-annotation-${ann.id}`}
              active={ann.id === activeAnnotation.id}
              className="cursor-pointer mb-2.5"
              onClick={() => setActiveAnnotation(ann)}
              key={`batch-review-ann-${ann.id}`}>
              <div className="flex flex-row items-center justify-between mb-2.5">
                <ReviewToggle
                  status={ann.status}
                  reviewAnnotation={(status) =>
                    onReviewAnnotation(status, {...ann})
                  }
                />
                <ConfidenceScoreLabel type={ann.score_cat} />
              </div>
              <Snippet {...snippet} />
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewSidebar;
