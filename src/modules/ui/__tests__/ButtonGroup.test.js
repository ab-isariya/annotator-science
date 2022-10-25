import ButtonGroup from '../ButtonGroup';
import renderer from 'react-test-renderer';

describe('<ButtonGroup/>', () => {
  it('Renders without crashing', () => {
    const comp = renderer.create(<ButtonGroup />).toJSON();

    expect(comp).toMatchSnapshot();
  });

  it('Renders with children', () => {
    const comp = renderer.create(<ButtonGroup>Hello</ButtonGroup>).toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp.children).not.toEqual(null);
  });

  it('Renders with a custom classname', () => {
    const comp = renderer
      .create(<ButtonGroup className="testClass" />)
      .toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp.props.className).toMatch(/testClass/i);
  });
});
