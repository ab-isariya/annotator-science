import Modal from '../Modal';

import renderer from 'react-test-renderer';
import {render} from '@testing-library/react';
import {fireEvent} from '@testing-library/dom';
import {getByTestId} from '@testing-library/dom';
import {shallow} from 'enzyme';

describe('<Modal/>', () => {
  it('Renders without crashing', () => {
    const comp = renderer
      .create(<Modal toggleModal={jest.fn()} open={false} />)
      .toJSON();

    expect(comp).toMatchSnapshot();
  });

  it('Renders nothing when open is false', () => {
    const comp = renderer
      .create(<Modal toggleModal={jest.fn()} open={false} />)
      .toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp).toBe(null);
  });

  it('Renders the modal when open is true', () => {
    const comp = renderer
      .create(<Modal toggleModal={jest.fn()} open={true} />)
      .toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp).not.toBe(null);
  });

  //TODO(Rejon): Come back to this, there's a problem with document event listeners not going through for fake keypresses.
  //			   Specifically, the wrapper we past to spyOn is either not getting the event listener or it receives 'undefined'.
  it('Handles the escape key correctly', () => {
    // let events = {};
    // document.addEventListener = jest.fn((event, cb) => {
    // 	events[event] = cb;
    // });
    // const doSomething = jest.fn();
    // const { container } = render(<Modal toggleModal={doSomething} open={true} />);
    // const wrapper = getByTestId(container, 'modal');
    // const spy = jest.spyOn(wrapper, 'handlerEsc');
    // events.keydown({ keycode: 27 });
    // expect(spy).toHaveBeenCalled();
  });
});
