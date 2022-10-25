import renderer from 'react-test-renderer';

import FilesDropZone from '../FilesDropzone';

describe('<FilesDropZone/>', () => {
  it('Renders without crashing', () => {
    const comp = renderer
      .create(<FilesDropZone onFileDrop={jest.fn()} />)
      .toJSON();

    expect(comp).toMatchSnapshot();
  });

  it('Renders with a custom classname without crashing', () => {
    const comp = renderer
      .create(<FilesDropZone onFileDrop={jest.fn()} className="testClass" />)
      .toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp.props.className).toMatch(/testClass/i);
  });
});
