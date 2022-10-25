import isNil from 'lodash/isNil';
import useSWR from 'swr';
import {newRidgeState} from 'react-ridge-state';

import {queryAnnotations} from '../api';
import {useDocument} from '@document';
import {useUser} from '@user';

// Annotation querying state.
export const annotationQueryState = newRidgeState(
  {
    // sort: [
    //   {
    //     field: 'start',
    //     desc: false
    //   }
    // ],
    filter: [],
    isDefault: true
  },
  {
    onSet: (newState) => {
      localStorage.setItem('@annotationQueryState', JSON.stringify(newState));
    }
  }
);

//Active annotation (Right Sidebar) state for when we're clicking on an annotation
//and showing a card or batch actions, ect.
export const rightSidebarState = newRidgeState(
  {
    activeAnnotation: null,
    currentMode: null,
    addModeState: null
  },
  {
    onSet: (newState) => {
      const _newState = {
        ...newState,
        activeAnnotation:
          newState.activeAnnotation !== null
            ? {
              ...newState.activeAnnotation,
              node: null
            }
            : null
      };

      localStorage.setItem('@rightSidebarState', JSON.stringify(_newState));
    }
  }
);

//Set initial state for active annotations and annotation query state.
//NOTE(Rejon): Since 2 states are in one file, we set initial state for both of them,
//             as best practice.
export const setInitialState = () => {
  const _rightSidebarState = localStorage.getItem('@rightSidebarState');
  if (_rightSidebarState) {
    const initialActiveAnnotationState = JSON.parse(_rightSidebarState);
    rightSidebarState.set(initialActiveAnnotationState);
  }

  const _annotationQueryState = localStorage.getItem('@annotationQueryState');
  if (_annotationQueryState) {
    const initialAnnotationQueryState = JSON.parse(_annotationQueryState);
    annotationQueryState.set(initialAnnotationQueryState);
  }
};

const useAnnotations = () => {
  const {data: user} = useUser();
  const {data: document} = useDocument();
  //TODO(Rejon): Update this to only be concerned about filterQuery
  const currentQuery = annotationQueryState.useValue();

  let getFromQuery = useSWR(
    !isNil(document) && !isNil(currentQuery) && currentQuery.isDefault === false
      ? [document.id, currentQuery, user.id, user.accessToken]
      : null,
    queryAnnotations
  );

  let getFromDocument = useSWR(
    !isNil(document) ? [...document.annotations] : null,
    () => document.annotations
  );

  // If we are using the default query for sorting/filtering, just use all
  // the annotations from our document.
  return currentQuery.isDefault ? getFromDocument : getFromQuery;
};

export default useAnnotations;
