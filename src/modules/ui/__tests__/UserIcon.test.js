import UserIcon from '../UserIcon';
import renderer from 'react-test-renderer';

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

jest.mock('@user', () => ({
  useUser: () => {
    return {
      data: {
        primary_email: 'hello@test.com'
      }
    };
  }
}));

describe('<UserIcon/>', () => {
  it('Renders without crashing', () => {
    const comp = renderer.create(<UserIcon />).toJSON();

    expect(comp).toMatchSnapshot();
  });
});
