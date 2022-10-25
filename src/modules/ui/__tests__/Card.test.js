import Card from '../Card';
import renderer from 'react-test-renderer';

describe('<Card/>', () => {
  it('Renders without crashing', () => {
    const comp = renderer.create(<Card />).toJSON();

    expect(comp).toMatchSnapshot();
  });

  it('Renders with children', () => {
    const comp = renderer.create(<Card>Hello</Card>).toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp.children).not.toEqual(null);
  });

  it('Renders with a custom classname', () => {
    const comp = renderer.create(<Card className="testClass" />).toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp.props.className).toMatch(/testClass/i);
  });

  it('Renders with a custom padding', () => {
    const comp = renderer.create(<Card padding="px-3" />).toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp.props.className).toMatch(/px-3/i);
  });

  it('Renders with active classes', () => {
    const comp = renderer.create(<Card active />).toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp.props.className).toMatch(/filter-active bg-grey-50/i);
  });

  it('Renders with hover classes', () => {
    const comp = renderer.create(<Card hover />).toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp.props.className).toMatch(/hover:bg-grey-50/i);
  });
});
