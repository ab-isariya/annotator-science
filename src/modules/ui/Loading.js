import PropTypes from 'prop-types';

const Loading = ({className}) => <div className={className}>Loading...</div>;

Loading.propTypes = {
  //TailwindCSS classnames
  className: PropTypes.string
};

export default Loading;
