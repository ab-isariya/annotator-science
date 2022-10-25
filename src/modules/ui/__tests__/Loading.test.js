import Loading from '../Loading';

import renderer from 'react-test-renderer';

describe('<Loading/>', () => {
  it('Renders without crashing', () => {
    const comp = renderer.create(<Loading />).toJSON();

    expect(comp).toMatchSnapshot();
  });

  it('Renders with a custom classname', () => {
    const comp = renderer.create(<Loading className="testClass" />).toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp.props.className).toMatch(/testClass/i);
  });
});
