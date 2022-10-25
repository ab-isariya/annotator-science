import ReactDOM from 'react-dom';
import TooltipGroup from '../TooltipGroup';
import renderer from 'react-test-renderer';

beforeAll(() => {
  ReactDOM.createPortal = jest.fn((element, node) => {
    return element;
  });
});

describe('<TooltipGroup/>', () => {
  it('Renders without crashing', () => {
    const comp = renderer
      .create(
        <TooltipGroup>
          <p>Hello</p>
        </TooltipGroup>
      )
      .toJSON();

    expect(comp).toMatchSnapshot();
  });

  it('Renders with children', () => {
    const comp = renderer
      .create(
        <TooltipGroup>
          <p>Hello</p>
        </TooltipGroup>
      )
      .toJSON();

    expect(comp).toMatchSnapshot();
  });

  it('Renders with dark and a set size', () => {
    const comp_dark = renderer
      .create(
        <TooltipGroup dark>
          <p>Hello</p>
        </TooltipGroup>
      )
      .toJSON();

    expect(comp_dark).toMatchSnapshot();

    const comp_size = renderer
      .create(
        <TooltipGroup size={'large'}>
          <p>Hello</p>
        </TooltipGroup>
      )
      .toJSON();

    expect(comp_size).toMatchSnapshot();
  });

  it('Renders with delay and transition', () => {
    const comp_delay = renderer
      .create(
        <TooltipGroup delay={1000}>
          <p>Hello</p>
        </TooltipGroup>
      )
      .toJSON();

    expect(comp_delay).toMatchSnapshot();

    const comp_transition = renderer
      .create(
        <TooltipGroup transition>
          <p>Hello</p>
        </TooltipGroup>
      )
      .toJSON();

    expect(comp_transition).toMatchSnapshot();
  });

  it('Renders with a custom theme', () => {
    const comp = renderer
      .create(
        <TooltipGroup theme="light">
          <p>Hello</p>
          <p>World</p>
        </TooltipGroup>
      )
      .toJSON();

    expect(comp).toMatchSnapshot();
  });
});
