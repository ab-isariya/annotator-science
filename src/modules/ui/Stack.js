import PropTypes from 'prop-types';

/**
 * Simple component to stack elements on top of another. AS OF NOW, IT CENTERS
 */
const Stack = ({children, className, ...otherProps}) => {
  return (
    <div className={`${className ? className : ''} relative`} {...otherProps}>
      {children[0]}
      <div
        className="absolute top-2/4 left-2/4"
        style={{
          transform: 'translate(-50%, -50%)'
        }}>
        {children[1]}
      </div>
    </div>
  );
};

Stack.propTypes = {
  /** Any additional class for component */
  className: PropTypes.string,
  //React node children
  children: PropTypes.node.isRequired
};

export default Stack;
