import {shallow} from 'enzyme';
import Alert from '../Alert';

import {ReactComponent as Close} from '@assets/svgs/Close.svg';
import {ReactComponent as TrashCan} from '@assets/svgs/TrashCan.svg';

describe('<Alert/>', () => {
  it('Renders without crashing', () => {
    const comp = shallow(<Alert />);

    expect(comp).toHaveLength(1);
  });

  it('Renders with close', () => {
    const comp = shallow(<Alert close={true} />);

    expect(comp.containsMatchingElement(<Close />)).toEqual(true);
  });

  it('Renders with close and children', () => {
    const _children = <p>I should render in alert.</p>;

    const comp = shallow(<Alert close={true}>{_children}</Alert>);

    expect(comp.containsMatchingElement(<Close />)).toEqual(true);
    expect(comp.containsMatchingElement(_children)).toEqual(true);
  });

  it('Renders with an icon', () => {
    const comp = shallow(<Alert icon={<TrashCan />} />);

    expect(comp.containsMatchingElement(<TrashCan />)).toEqual(true);
  });

  it('Renders with an icon and children', () => {
    const _children = <p>I should render in alert.</p>;

    const comp = shallow(<Alert icon={<TrashCan />}>{_children}</Alert>);

    expect(comp.containsMatchingElement(<TrashCan />)).toEqual(true);
    expect(comp.containsMatchingElement(_children)).toEqual(true);
  });

  it('Renders with an icon and children and a close icon', () => {
    const _children = <p>I should render in alert.</p>;

    const comp = shallow(
      <Alert icon={<TrashCan />} close={true}>
        {_children}
      </Alert>
    );

    expect(comp.containsMatchingElement(<Close />)).toEqual(true);
    expect(comp.containsMatchingElement(<TrashCan />)).toEqual(true);
    expect(comp.containsMatchingElement(_children)).toEqual(true);
  });
});
