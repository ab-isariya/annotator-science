import renderer from 'react-test-renderer';
import {useLocation} from 'react-router';
import Home from '../Home';

jest.mock('react-router-dom', () => ({
  useLocation: () => ({
    pathname: '/'
  })
}));

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {isAuthenticated: true},
      authService: {handleAuthentication: jest.fn()},
      oktaAuth: {
        tokenManager: {
          on: jest.fn()
        }
      }
    };
  }
}));

describe('Home Page', () => {
  it('Renders without crashing', () => {
    const comp = renderer.create(<Home />).toJSON();
    //TODO(Rejon): Figure out best way to render things and check they aren't crashing.
    expect(comp).toMatchSnapshot();
  });
});
