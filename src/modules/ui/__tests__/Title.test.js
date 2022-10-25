import Title from '../Title';

import renderer from 'react-test-renderer';

describe('<Title/>', () => {
  it('Renders without crashing', () => {
    const comp = renderer.create(<Title />).toJSON();

    expect(comp).toMatchSnapshot();
  });

  it('Renders with size xl', () => {
    const comp = renderer.create(<Title size="xl" />).toJSON();

    expect(comp).toMatchSnapshot();
  });

  it('Renders with size lg', () => {
    const comp = renderer.create(<Title size="lg" />).toJSON();

    expect(comp).toMatchSnapshot();
  });

  it('Renders with children', () => {
    const comp = renderer.create(<Title>Hello</Title>).toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp.children.length).not.toBe(0);
  });

  it('Renders with an unsupported size', () => {
    const comp = renderer.create(<Title size="md" />).toJSON();

    expect(comp).toMatchSnapshot();
  });
});
