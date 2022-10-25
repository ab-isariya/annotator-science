import {cache} from 'swr';

beforeEach(() => cache.clear());

import ActiveAnnotationCard, {StatusBorder} from '../ActiveAnnotationCard';
import {statusStyles} from '@styles/AnnotationStyles';
import {AnnotationStatus} from '../../utils/constants';

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {isAuthenticated: true},
      authService: {handleAuthentication: jest.fn()},
      oktaAuth: {
        tokenManager: {
          on: jest.fn()
        }
      }
    };
  }
}));

jest.mock('react-router-dom', () => ({
  useParams: () => ({
    docID: 1
  })
}));

describe('<ActiveAnnotationCard/>', () => {
  it('renders without crashing', () => {
    const mockAnnotation = {
      tag: 'chemicals & drugs',
      score_cat: 'VERY_HIGH',
      canonical_id: 'UMLS:C0042212',
      canonical_name: 'Vaccines, Inactivated',
      text: 'inactivated vaccine',
      status: 'NOT_REVIEWED',
      datetime_modified: '2021-06-24T16:31:03.219513',
      id: '1',
      entity_p: 0.9997294545173645,
      datetime_created: '2021-06-24T16:31:03.219513',
      end: '77',
      start: '58',
      datetime_reviewed: null,
      node: null
    };

    shallow(<ActiveAnnotationCard {...mockAnnotation} />);
  });

  it('Renders as a Manual Annotation Card', () => {
    const mockAnnotation = {
      tag: 'chemicals & drugs',
      score_cat: 'VERY_HIGH',
      canonical_id: 'UMLS:C0042212',
      canonical_name: 'Vaccines, Inactivated',
      text: 'inactivated vaccine',
      status: 'MANUAL',
      datetime_modified: '2021-06-24T16:31:03.219513',
      id: '1',
      entity_p: 0.9997294545173645,
      datetime_created: '2021-06-24T16:31:03.219513',
      end: '77',
      start: '58',
      datetime_reviewed: null,
      node: null
    };

    const tree = shallow(<ActiveAnnotationCard {...mockAnnotation} />);

    expect(tree).toMatchSnapshot();
  });

  it('should render a Status Border', () => {
    const mockAnnotation = {
      tag: 'chemicals & drugs',
      score_cat: 'VERY_HIGH',
      canonical_id: 'UMLS:C0042212',
      canonical_name: 'Vaccines, Inactivated',
      text: 'inactivated vaccine',
      status: 'NOT_REVIEWED',
      datetime_modified: '2021-06-24T16:31:03.219513',
      id: '1',
      entity_p: 0.9997294545173645,
      datetime_created: '2021-06-24T16:31:03.219513',
      end: '77',
      start: '58',
      datetime_reviewed: null,
      node: null
    };

    const _StatusBorder = (
      <StatusBorder
        status={'NOT_REVIEWED'}
        className={`status-border absolute h-full left-0 top-0 ${statusStyles['NOT_REVIEWED'].bg}`}
        style={{width: '6px'}}></StatusBorder>
    );

    const wrapper = shallow(<ActiveAnnotationCard {...mockAnnotation} />);

    expect(wrapper.contains(_StatusBorder)).toBe(true);
  });
});

describe('<StatusBorder/>', () => {
  it('renders status border as Accepted', () => {
    const tree = shallow(<StatusBorder status={AnnotationStatus.ACCEPTED} />);

    expect(tree).toMatchSnapshot();
  });

  it('renders status border as Not Reviewed', () => {
    const tree = shallow(
      <StatusBorder status={AnnotationStatus.NOT_REVIEWED} />
    );

    expect(tree).toMatchSnapshot();
  });

  it('renders status border as Rejected', () => {
    const tree = shallow(<StatusBorder status={AnnotationStatus.REJECTED} />);
    expect(tree).toMatchSnapshot();
  });
});
