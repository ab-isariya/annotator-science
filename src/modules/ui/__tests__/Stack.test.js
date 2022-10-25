import Stack from '../Stack';

import renderer from 'react-test-renderer';

describe('<Stack/>', () => {
  it('Renders without crashing', () => {
    const comp = renderer
      .create(
        <Stack>
          <p>Hello</p> <p>World</p>
        </Stack>
      )
      .toJSON();

    expect(comp).toMatchSnapshot();
  });

  it('Renders without crashing with only 1 child', () => {
    const comp = renderer
      .create(
        <Stack>
          <p>Hello</p>
        </Stack>
      )
      .toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp.children.length).toBe(1);
  });

  it('Renders without crashing with more than 2 children', () => {
    const comp = renderer
      .create(
        <Stack>
          <p>Hello</p>
          <p>World</p>
          <p>How are you?</p>
        </Stack>
      )
      .toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp.children.length).toBe(2);
    expect(comp.children[1].children.length).toBe(1);
  });

  it('Renders with a custom classname', () => {
    const comp = renderer
      .create(
        <Stack className="testClass">
          <p>Hello</p>
          <p>World</p>
        </Stack>
      )
      .toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp.props.className).toMatch(/testClass/i);
  });
});
