import isNil from 'lodash/isNil';
import useSWR from 'swr';
import {useOktaAuth} from '@okta/okta-react';
import {toast} from 'react-toastify';

import {API_ENDPOINT} from '@config';

//NOTE(Rejon): With okta logins/signups we can't verify if a user has JUST
//             been created. This is due to okta "just in time" adding users
//             based on our social login rules. With that in mind we MUST
//             also support it on our backend.
export const getUserWithAuthID =
  (oktaAuth) => async (endpoint, accessToken) => {
    
    try {
      const {sub, email} = await oktaAuth.getUser(accessToken);

      const res = await fetch(
        `${API_ENDPOINT}${endpoint}?auth_id=${sub}&jit=true&primary_email=${email}`,
        {
          method: 'GET',
          headers: {
            Authorization: accessToken.value
          }
        }
      );

      const user = await res.json();

      return {
        ...user,
        ...accessToken //NOTE(Rejon): Pass accessToken so we have it available.
      };
    } catch (err) {
      toast.error('There was an error with your request. Please try again.');
      throw err;
    }
  };

const useUser = () => {
  // Grab the user's Okta data
  const {oktaAuth, authState} = useOktaAuth();



  // Get user data based on Okta ID
  return useSWR(
    !isNil(oktaAuth.isAuthenticated) && !isNil(authState.accessToken) ? ['/user', authState.accessToken] : null,
    getUserWithAuthID(oktaAuth),
    {
      revalidateOnFocus: false,
      refreshInterval: 0
    }
  );
};

export default useUser;
