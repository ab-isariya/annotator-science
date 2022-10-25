import FileTypeIcon from '../FileTypeIcon';
import {FileTypes} from '@utils/constants';

import renderer from 'react-test-renderer';

describe('<FileTypeIcon/>', () => {
  it('Renders without crashing', () => {
    const comp = renderer.create(<FileTypeIcon type={'.docx'} />).toJSON();

    expect(comp).toMatchSnapshot();
  });

  it('Renders with a custom classname', () => {
    const comp = renderer
      .create(<FileTypeIcon type={'.pdf'} className="testClass" />)
      .toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp.props.className).toMatch(/testClass/i);
  });
});
