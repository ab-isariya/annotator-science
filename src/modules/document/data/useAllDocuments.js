import isNil from 'lodash/isNil';
import useSWR from 'swr';
import { newRidgeState } from 'react-ridge-state';
import {getDocumentList} from '@document/api';
import {useUser} from '@user';
import {ProcessingState} from '@utils/constants';

const noDocumentsProcessingState = newRidgeState(true);

function useAllDocuments() {
  const {data: user} = useUser();
  const noDocumentsProcessing = noDocumentsProcessingState.useValue();

  let userData = {};
  if (!isNil(user)) {
    userData = {
      id: user.id,
      accessToken: `${user.tokenType} ${user.accessToken}`
    };
  }

  const swrFetch = useSWR(
    isNil(user) ? null : ['/documents', userData.accessToken, userData.id],
    getDocumentList,
    {
      revalidateOnFocus: false,
      refreshInterval: noDocumentsProcessing ? 0 : 150,
    }
  );

  const {data: files, error} = swrFetch;
  const noneProcessing = files?.every(f => f['processing_state'] !== ProcessingState.PROCESSING);

  if (noneProcessing && !noDocumentsProcessing) //Files processing, but our state says it isn't.
  {
    noDocumentsProcessingState.set(true);
  }
  else if (!noneProcessing && noDocumentsProcessing) //None are process, but our state says it is, set to false.
  {
    noDocumentsProcessingState.set(false);
  }
  else if (!noneProcessing && error) //Do not keep retrying if there's an error
  {
    noDocumentsProcessingState.set(true);
  }

  // Read more on passing arguments
  // https://swr.vercel.app/docs/arguments#passing-objects
  return swrFetch;
}

export default useAllDocuments;
