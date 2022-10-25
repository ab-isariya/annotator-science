import ReactDOM from 'react-dom';

import renderer from 'react-test-renderer';

import ConfidenceScoreLabel from '../ConfidenceScoreLabel';
import {ConfidenceScore} from '@utils/constants';

//NOTE(Rejon): If we don't do this we'll get an error cause Tippy is using React.createPortal, which the testing library doesn't support.
beforeAll(() => {
  ReactDOM.createPortal = jest.fn((element, node) => {
    return element;
  });
});

describe('<ConfidenceScoreLabel/>', () => {
  it('Renders without crashing', () => {
    const comp = renderer
      .create(
        <ConfidenceScoreLabel type={ConfidenceScore['very_high'].score_cat} />
      )
      .toJSON();

    expect(comp).toMatchSnapshot();
  });

  it('Renders a low key type without crashing', () => {
    const comp = renderer
      .create(<ConfidenceScoreLabel type={ConfidenceScore['low'].score_cat} />)
      .toJSON();

    expect(comp).toMatchSnapshot();
  });
});
