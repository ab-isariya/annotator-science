import {shallow} from 'enzyme';
import App from './App';
// import { cache, SWRConfig } from 'swr';

// const Wrapper = ({ children }) => (
// 	<SWRConfig value={{ dedupingInterval: 0 }}>
// 		{children}
// 	</SWRConfig>
// );

it('renders without crashing', () => {
  shallow(<App />);
});
