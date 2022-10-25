import PropTypes from 'prop-types';

/**
 * Horizontal background bar
 *
 * @param {String} bgColor - background color (tailwind valid)
 * @param {String} padding - (tailwind valid)
 * @param {String} size - width of background
 * @param {Object} children - React elements to appear on top of bar
 * @return {JSX.Element}
 */
const Bar = ({bgColor, padding, size, children}) => (
  <div className="relative flex-1">
    {/* Background bar */}
    <div
      className={`absolute h-full left-0 rounded-r-md ${bgColor}`}
      style={{width: `${size}%`}}
    />
    <div className={`relative flex items-center ${padding}`}>{children}</div>
  </div>
);

Bar.propTypes = {
  //Color of the background horizontal bar
  bgColor: PropTypes.string.isRequired,
  //Padding class names from tailwind for the horizontal bar
  padding: PropTypes.string,
  //Percentage of the bar to be filled (0% - 100%)
  size: PropTypes.number.isRequired,
  //Children nodes to be rendered inside of the bar.
  children: PropTypes.node
};

export default Bar;
