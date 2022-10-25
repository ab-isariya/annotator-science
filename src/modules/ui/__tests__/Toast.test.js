import Toast from '../Toast';
import renderer from 'react-test-renderer';

describe('<Toast/>', () => {
  it('Renders without breaking', () => {
    const comp = renderer.create(<Toast />).toJSON();

    expect(comp).toMatchSnapshot();
  });
});
