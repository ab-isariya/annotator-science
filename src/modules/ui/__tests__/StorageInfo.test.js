import StorageInfo from '../StorageInfo';
import {humanFileSize} from '@utils/transformers';

import renderer from 'react-test-renderer';

describe('<StorageInfo/>', () => {
  it('Renders without crashing', () => {
    const comp = renderer
      .create(<StorageInfo used={100} total={150} />)
      .toJSON();

    expect(comp).toMatchSnapshot();
  });

  it('Renders with a positive percentage', () => {
    const comp = renderer
      .create(<StorageInfo used={25} total={100} />)
      .toJSON();

    expect(comp).toMatchSnapshot();
  });

  it('Renders with a negative percentage', () => {
    const comp = renderer
      .create(<StorageInfo used={-25} total={100} />)
      .toJSON();

    expect(comp).toMatchSnapshot();
  });

  it('Renders with a 100% total', () => {
    const comp = renderer
      .create(<StorageInfo used={100} total={100} />)
      .toJSON();

    expect(comp).toMatchSnapshot();
  });

  it('Renders with a total greater than 100%', () => {
    let fileSizeMax = humanFileSize(110);

    const comp = renderer
      .create(<StorageInfo used={110} total={100} />)
      .toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp.children[1].children[0].children[0]).toBe(fileSizeMax);
  });
});
