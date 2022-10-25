/* eslint-disable */
import isNil from 'lodash/isNil';
import produce from 'immer';
import useSWR from 'swr';
import {useParams} from 'react-router-dom';
import {newRidgeState} from 'react-ridge-state';

import {rightSidebarState, annotationQueryState} from '@document';
import {getDocument} from '../api';
import {useUser} from '@user';
import {DocumentViewTypes, DocumentExportTypes} from '@utils/constants';

export const documentViewState = newRidgeState(
  {
    currentView: DocumentViewTypes.DOCUMENT,
    agGridApi: null,
    currentDocument: null
  },
  {
    onSet: (newState) => {
      //NOTE(Rejon): Don't set agGridApi here, super unnecessary.
      localStorage.setItem(
        '@documentViewState',
        JSON.stringify({...newState, agGridApi: null})
      );
    }
  }
);

//Testing

//Set the initial state for the document view into local storage
//NOTE(Rejon): Executed in InitializeState util on the first app load.
export const setInitialState = () => {
  const item = localStorage.getItem('@documentViewState');
  if (item) {
    const initialState = JSON.parse(item);
    documentViewState.set(initialState);
  }
};

export const documentExportTypeState = newRidgeState(DocumentExportTypes.CSV);

const useDocument = () => {
  const {docID} = useParams(); //Get doc id from url param
  const {data: user} = useUser();
  const {currentDocument} = documentViewState.useValue();

  const shouldFetch = !isNil(docID) && !isNil(user?.id);

  const docData = shouldFetch
    ? {
        userID: user.id,
        accessToken: user.accessToken.accessToken,
        docID: docID
      }
    : {};

  //Check if the document id we have in storage is the same as the current.
  //If it's not reset active annotations and the annotation query state for filters.
  //Then update the storage document id.
  if (currentDocument !== docID && !isNil(docID)) {
    rightSidebarState.reset(); //Reset Active Annotations
    annotationQueryState.reset(); //Reset Annotation Querying

    //Update documentViewState with current docID.
    documentViewState.set((prev) =>
      produce(prev, (updated) => {
        updated.currentDocument = docID;
      })
    );
  }

  return useSWR(
    shouldFetch ? [docID, '/document', user.id, user.accessToken] : null,
    (document_id, url, user_id, accessToken) => getDocument(url, document_id, user_id, accessToken),
    {
      revalidateOnMount: true
    }
  );
};

export default useDocument;
