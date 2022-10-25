import {Route, Switch, useHistory} from 'react-router-dom';

import {LoginCallback, SecureRoute, Security} from '@okta/okta-react';
import {toRelativeUrl} from '@okta/okta-auth-js';

import ErrorBoundary from '@utils/ErrorBoundary';
import Toast from '@ui/Toast';
import {Document, Home} from '@pages';
import {OKTACONFIG} from '@modules/user';
import {Helmet} from 'react-helmet';

export default function App() {
  const history = useHistory();

  /* istanbul ignore next */
  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    history.replace(toRelativeUrl(originalUri, window.location.origin));
  };

  //NOTE(Rejon): Necessary as part of the Okta update. See: https://github.com/okta/okta-auth-js/#running-as-a-service
  //NOTE(Rejon): Only for Okta-react 6+
  // useEffect(() => {
  //   OKTACONFIG.start();

  //   return () => {
  //     OKTACONFIG.stop();
  //   };
  // }, []);

  return (
    <ErrorBoundary>
      <Security oktaAuth={OKTACONFIG} restoreOriginalUri={restoreOriginalUri}>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <SecureRoute path="/document/:docID">
            <Document />
          </SecureRoute>

          <Route path="/login/callback" component={LoginCallback} />
        </Switch>
      </Security>

      <Toast />
      <Helmet>
        {process.env.NODE_ENV !== 'development' && (
          <>
            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-YJ87JDCJH2"></script>
            <script>
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-YJ87JDCJH2');
              `}
            </script>
          </>
        )}
      </Helmet>
    </ErrorBoundary>
  );
}
