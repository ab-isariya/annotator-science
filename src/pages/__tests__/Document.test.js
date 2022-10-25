import Document from '../Document';

describe('Document Page', () => {
  it('Renders without crashing', () => {
    const comp = shallow(<Document />);

    expect(comp).toHaveLength(1);
  });
});
