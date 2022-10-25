import ErrorBoundary from '../ErrorBoundary';
import {shallow} from 'enzyme';

const Something = () => null;

describe('<ErrorBoundary>', () => {
  it('should display an ErrorMessage if wrapped component throws', () => {
    const wrapper = shallow(
      <ErrorBoundary>
        <Something />
      </ErrorBoundary>
    );

    const error = new Error('test');

    wrapper.find(Something).simulateError(error);

    expect(wrapper.children('Alert')).toHaveLength(1);
  });
});
