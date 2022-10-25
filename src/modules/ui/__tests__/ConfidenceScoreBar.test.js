import renderer from 'react-test-renderer';

import ConfidenceScoreBar from '../ConfidenceScoreBar';

import {ConfidenceScore} from '@utils/constants';

describe('<ConfidenceScoreBar/>', () => {
  it('Renders without crashing', () => {
    const comp = renderer
      .create(
        <ConfidenceScoreBar type={ConfidenceScore['very_high'].score_cat} />
      )
      .toJSON();

    expect(comp).toMatchSnapshot();
  });

  it('Renders a low key type without crashing', () => {
    const comp = renderer
      .create(<ConfidenceScoreBar type={ConfidenceScore['low'].score_cat} />)
      .toJSON();

    expect(comp).toMatchSnapshot();
  });

  it('Renders with size provided without crashing', () => {
    const comp = renderer
      .create(
        <ConfidenceScoreBar size={20} type={ConfidenceScore['low'].score_cat} />
      )
      .toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp.children[0].props.style.width).toMatch(/20%/i);
  });
});
