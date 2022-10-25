import {shallow} from 'enzyme';
import Badge from '../Badge';

describe('<Badge/>', () => {
  it('Renders without crashing', () => {
    const comp = shallow(<Badge />);

    expect(comp).toHaveLength(1);
  });

  it('Renders with children', () => {
    const _children = <p>I should render in Badge.</p>;

    const comp = shallow(<Badge>{_children}</Badge>);

    expect(comp.find('span').containsMatchingElement(_children)).toEqual(true);
  });

  it('Renders disabled', () => {
    const comp = shallow(<Badge disabled={true} />);

    expect(comp.find('span').hasClass('bg-grey-100')).toEqual(true);
  });

  it('Renders disabled with children', () => {
    const _children = <p>I should render in Badge.</p>;

    const comp = shallow(<Badge disabled={true}>{_children}</Badge>);

    expect(comp.find('span').containsMatchingElement(_children)).toEqual(true);
    expect(comp.find('span').hasClass('bg-grey-100')).toEqual(true);
  });

  it('Renders with a custom classname', () => {
    const comp = shallow(<Badge className="border-red-500" />);

    expect(comp.find('span').hasClass('border-red-500')).toEqual(true);
  });

  it('Renders disabled with a custom classname', () => {
    const comp = shallow(<Badge className="border-red-500" disabled={true} />);

    expect(comp.find('span').hasClass('border-red-500')).toEqual(true);
    expect(comp.find('span').hasClass('bg-grey-100')).toEqual(true);
  });
});
