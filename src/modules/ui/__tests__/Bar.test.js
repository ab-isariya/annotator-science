import Bar from '../Bar';
import renderer from 'react-test-renderer';

describe('<Bar/>', () => {
  it('Renders without crashing', () => {
    const comp = renderer
      .create(<Bar bgColor="bg-blue-500" size={0} />)
      .toJSON();

    expect(comp).toMatchSnapshot();
  });

  const Wrapper = ({children, width}) => <div style={{width}}>{children}</div>;

  it('Renders with a blue-500 bar at 100% width', () => {
    const bar = <Bar bgColor="bg-blue-500" size={100} />;

    const comp = renderer
      .create(<Wrapper width="200px">{bar}</Wrapper>)
      .toJSON();

    expect(comp.children[0].children[0].props.className).toMatch(
      /(bg-blue-500)/i
    );
    expect(comp.children[0].children[0].props.style.width).toMatch(/(100%)/i);
    expect(comp).toMatchSnapshot();
  });

  it('Renders with children, a red-500 bar, and a padding of px-2', () => {
    const comp = renderer
      .create(
        <Bar bgColor="bg-red-500" size={100} padding="px-2">
          I should render.
        </Bar>
      )
      .toJSON();

    expect(comp.children[0].props.className).toMatch(/(bg-red-500)/i);
    expect(comp.children[1].props.className).toMatch(/(px-2)/i);
    expect(comp).toMatchSnapshot();
  });
});
