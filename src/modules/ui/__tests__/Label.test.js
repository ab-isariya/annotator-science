import renderer from 'react-test-renderer';

import Label from '../Label';

describe('<Label/>', () => {
  it('Renders without crashing', () => {
    const comp = renderer.create(<Label />).toJSON();

    expect(comp).toMatchSnapshot();
  });

  it('Renders with a custom classname', () => {
    const comp = renderer.create(<Label className="testClass" />).toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp.props.className).toMatch(/testClass/i);
  });

  it('Renders with with the primary styles', () => {
    const comp = renderer.create(<Label primary />).toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp.props.className).toMatch(/text-grey-900/i);
  });

  it('Renders with the secondary styles', () => {
    const comp = renderer.create(<Label secondary />).toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp.props.className).toMatch(/text-grey-500/i);
  });

  it('Renders with default font size and line height', () => {
    const comp = renderer.create(<Label />).toJSON();

    expect(comp.props.className).toMatch(/text-sm leading-5/i);
  });

  it('Renders with small size styles', () => {
    const comp = renderer.create(<Label small />).toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp.props.className).toMatch(/text-xs leading-4/i);
  });

  it("Renders it's children", () => {
    const comp = renderer.create(<Label>Hello</Label>).toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp.children).not.toEqual(null);
  });
});
