import PropTypes from 'prop-types';

const Card = ({children, className, padding, active, hover, ...otherProps}) => (
  <div
    className={`border border-grey-100 rounded-md  ${padding || 'p-4'} 
      ${active ? 'filter-active bg-grey-50' : 'bg-white'}
      ${hover ? 'hover:bg-grey-50' : ''}
      ${className}`}
    {...otherProps}>
    {children}
  </div>
);

Card.propTypes = {
  //Classnames from TailwindCSS
  className: PropTypes.string,
  //Children rendered inside of container
  children: PropTypes.node,
  //Extraneous props attached to the container for things like onClick, onHover, ect.
  otherProps: PropTypes.any,
  //Padding Classname from tailwind to use
  //NOTE(Rejon): Some cards require scrolling that can get too cramped using initial p-4
  //             padding. This will enable manually setting padding for children elements.
  padding: PropTypes.string,
  //If this card should have the active style or not.
  active: PropTypes.bool,
  //If this card should use hover styles
  hover: PropTypes.bool
};

export default Card;
