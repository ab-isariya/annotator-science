import {useRef, useEffect} from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import isNil from 'lodash/isNil';
import produce from 'immer';

import {rightSidebarState, useAnnotations} from '@document';
import {AnnotationStatus, RightSidebarModes} from '@utils/constants';
import {
  annActiveStyles,
  annBGStyles,
  annDecorationStyles,
  annTextStyles
} from '@styles/AnnotationStyles';

const DocumentAnnotation = ({annotation}) => {
  const ref = useRef();
  const {activeAnnotation, currentMode} = rightSidebarState.useValue();
  const {data: annotations} = useAnnotations();

  const {id, text, tag, status, canonical_id} = annotation;

  const isActiveAnnotation = activeAnnotation?.id === id;
  const isLinkedAnnotation =
    currentMode === RightSidebarModes.REVIEW &&
    activeAnnotation?.linkedCanonicalAnnotations?.some((e) => e.id === id);

  //Annotations that share the same canonical_id.
  //NOTE(Rejon): This is used mostly for batch actions.
  const linkedCanonicalAnnotations = annotations?.filter(
    (el) => el.canonical_id === canonical_id
  );

  //Initial annotation mount, set the node in annotation state,
  //since we can't save a node reference in local storage.
  useEffect(() => {
    if (isActiveAnnotation && isNil(annotation.node)) {
      rightSidebarState.set((prev) =>
        produce(prev, (updated) => {
          updated.activeAnnotation = {
            ...annotation,
            linkedCanonicalAnnotations,
            node: ref.current
          };
        })
      );
    }
  }, []);

  //Default base classes regardless of annotation state
  const defaultClass =
    'annotation py-1 rounded-md decoration-clone cursor-pointer';

  //Active classes if annotation is part of active annotations list
  const activeClass = isActiveAnnotation
    ? `border border-solid ${annActiveStyles[tag]} `
    : 'px-px';

  const linkedBatchClass = isActiveAnnotation
    ? `border border-solid ${annActiveStyles[tag]} filter-active`
    : `border border-solid ${annActiveStyles[tag]}`;

  //Status class styles based on the review status of an annotation
  let statusClass = 'font-serif font-normal'; //Default is Unreviewed (AnnotationStatus.NOT_REVIEWED)

  //Set classes based on Annotation Status
  switch (status) {
  case AnnotationStatus.ACCEPTED: {
    statusClass = `font-sans font-bold ${annTextStyles[tag]}`;
    break;
  }
  case AnnotationStatus.REJECTED: {
    statusClass = `font-serif line-through font-bold ${annDecorationStyles[tag]} text-black`;
    break;
  }
  case AnnotationStatus.MANUAL: {
    statusClass = '';
    break;
  }
  default: {
    statusClass = `${annTextStyles[tag]}`;
  }
  }

  const pulseClass = classNames({
    'animate-redpulse':
      status === AnnotationStatus.REJECTED && isActiveAnnotation,
    'animate-greenpulse':
      status === AnnotationStatus.ACCEPTED && isActiveAnnotation
  });

  if (!annotations) {
    return (
      <span
        id={`annotation-${id}`}
        ref={ref}
        className={`${defaultClass}  
					  ${annBGStyles[tag]}
					  ${activeClass}
					  ${statusClass}
            ${pulseClass}
					`}>
        {text}
      </span>
    );
  }

  /**
   * Set annotation as active, adding it to array of active annotations
   */
  const setActiveAnnotation = () => {
    rightSidebarState.set((prev) =>
      produce(prev, (updated) => {
        // If we're setting the same Active Annotation, unset it.
        if (isActiveAnnotation) {
          if (currentMode !== RightSidebarModes.REVIEW) {
            //NOTE(Rejon): Design says clicking an already active annotation
            //             in batch mode should do nothing.
            updated.activeAnnotation = null;
          }
        } else {
          //Find all annotations that share a canonical_id.

          if (
            linkedCanonicalAnnotations.every(
              (n) => n.status === AnnotationStatus.MANUAL
            )
          ) {
            updated.activeAnnotation = {
              ...annotation,
              linkedCanonicalAnnotations: null,
              node: ref.current
            };
          } else {
            updated.activeAnnotation = {
              ...annotation,
              linkedCanonicalAnnotations,
              node: ref.current
            };
          }
        }
      })
    );

    if (currentMode === RightSidebarModes.REVIEW) {
      const reviewList = document.getElementById('review-sidebar-list');

      reviewList.scroll({
        top:
          document.getElementById(`batch-review-annotation-${annotation.id}`)
            .offsetTop - 10,
        left: 0,
        behavior: 'smooth'
      });
    }
  };

  if (currentMode === RightSidebarModes.REVIEW) {
    if (isLinkedAnnotation) {
      return (
        <span
          id={`annotation-${id}`}
          ref={ref}
          className={`
          ${defaultClass} 
          ${linkedBatchClass} 
          ${statusClass}`}
          onClick={setActiveAnnotation}>
          {text}
        </span>
      );
    } else {
      return <span id={`annotation-${id}`}>{text}</span>;
    }
  }

  return (
    <span
      id={`annotation-${id}`}
      ref={ref}
      className={`${defaultClass}  
					  ${annBGStyles[tag]}
					  ${activeClass}
					  ${statusClass}
            ${pulseClass}
					`}
      onClick={setActiveAnnotation}>
      {text}
    </span>
  );
};

//NOTE(Rejon): These parameters come from the annotation object provided via the backend.
//See GET "Get Document" response documentation: https://scienceio.postman.co/workspace/Text-Annotation-Tool~a06e82da-f019-4e9e-8a6f-8916c6abaedf/documentation/13083656-1898263e-67a4-4403-b04b-77bef84834a0
DocumentAnnotation.propTypes = {
  annotation: PropTypes.shape({
    /** Canonical ID for annotation in MESH:***** */
    canonical_id: PropTypes.string,
    /** Canonical name */
    canonical_name: PropTypes.string,
    /** Datetime creation of annotation (YYYY-MM-DDTHH:MM:SSSS) format */
    datetime_created: PropTypes.string,
    /** Datetime last modified of annotation (YYYY-MM-DDTHH:MM:SSSS) format */
    datetime_modified: PropTypes.string,
    /** Datetime last reviewed of annotation (YYYY-MM-DDTHH:MM:SSSS) format */
    datetime_reviewed: PropTypes.string,
    /** End Character position in document */
    end: PropTypes.number,
    /** Model Confidence Score */
    entity_p: PropTypes.number,
    /** ??? Not being used but shows up atm */
    feedback: PropTypes.string,
    /** Unique ID for annotation */
    id: PropTypes.number.isRequired,
    /** Start Character position in document */
    start: PropTypes.number,
    /** Annotation Status (see AnnotationStatus in utils/utils) for expected enums */
    status: PropTypes.string.isRequired,
    /** Annotation Type tag (ie. medical condition, cell biology, ect.) */
    tag: PropTypes.string.isRequired,
    /** Plain text of annotation, how it appears in the document */
    text: PropTypes.string.isRequired,
    node: PropTypes.node
  })
};

export default DocumentAnnotation;
