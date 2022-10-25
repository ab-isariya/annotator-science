import {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

import LoadingBar from 'react-top-loading-bar';

/**
 * Displays a loading bar on top of the page
 *
 * This component needs to be provided a prop to finish the bar and
 * make it disappear. The logic to determine when the page loads belong
 * into the parent. This component only needs the variable to change from
 * false to true.
 *
 * @param completeOn
 * @return {JSX.Element}
 * @constructor
 */
const TopLoadingBar = ({completeOn}) => {
  const loadingBarRef = useRef(null);

  /** Values and start/stop for the loading gradient */
  const loadingGradient =
    'linear-gradient(76deg, rgba(177,140,222,1) 0%, rgba(148,142,232,1) 7%, rgba(89,145,237,1) 15%, rgba(66,167,221,1) 24%, rgba(101,190,208,1) 33%, rgba(140,205,207,1) 42%, rgba(163,201,184,1) 51%, rgba(182,205,175,1) 56%, rgba(204,204,162,1) 61%, rgba(220,198,152,1) 65%, rgba(233,185,148,1) 70%, rgba(239' +
    ',173,150,1) 74%, rgba(240,162,156,1) 81%, rgba(234,149,163,1) 87%, rgba(205,133,176,1) 93%, rgba(170,134,174,1) 98%)';

  /**
   * Start loading gradient when page loads
   */
  useEffect(() => {
    loadingBarRef.current.continuousStart();
  }, []);

  /**
   * Start loading gradient when page loads
   */
  useEffect(() => {
    loadingBarRef.current.complete();
  }, [completeOn]);

  return <LoadingBar height={4} color={loadingGradient} ref={loadingBarRef} />;
};

TopLoadingBar.propTypes = {
  /* Set to false to complete the bar and make it disappear */
  completeOn: PropTypes.bool
};

export default TopLoadingBar;
