import TypeTag from '../TypeTag';
import renderer from 'react-test-renderer';
import {annotationTypes} from '@utils/constants';

describe('<TypeTag/>', () => {
  it('Renders without crashing', () => {
    const comp = renderer
      .create(<TypeTag type={annotationTypes.ANATOMY} />)
      .toJSON();

    expect(comp).toMatchSnapshot();
  });

  it('Renders with a defined size', () => {
    const comp = renderer
      .create(<TypeTag size={20} type={annotationTypes.ANATOMY} />)
      .toJSON();

    expect(comp).toMatchSnapshot();
  });
});
