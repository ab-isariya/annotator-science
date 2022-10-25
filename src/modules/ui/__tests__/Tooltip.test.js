import ReactDOM from 'react-dom';
import Tooltip from '../Tooltip';

import renderer from 'react-test-renderer';

beforeAll(() => {
  ReactDOM.createPortal = jest.fn((element, node) => {
    return element;
  });
});

describe('<Tooltip/>', () => {
  it('Renders without crashing', () => {
    const comp = renderer
      .create(<Tooltip content={'World'}>Hello</Tooltip>)
      .toJSON();

    expect(comp).toMatchSnapshot();
  });

  it('Renders with dark and a set size', () => {
    const comp_dark = renderer
      .create(
        <Tooltip content={'World'} dark>
          Hello
        </Tooltip>
      )
      .toJSON();

    expect(comp_dark).toMatchSnapshot();

    const comp_size = renderer
      .create(
        <Tooltip content={'Size'} size={'small'}>
          Super
        </Tooltip>
      )
      .toJSON();

    expect(comp_size).toMatchSnapshot();
  });
});
