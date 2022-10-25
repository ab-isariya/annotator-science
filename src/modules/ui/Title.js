import PropTypes from 'prop-types';

const Title = ({children, className, size}) => {
  const baseFonts = 'font-inter font-light';

  if (size === 'xl') {
    return (
      <h1 className={`${baseFonts} text-2xl leading-9 ${className}`}>
        {children}
      </h1>
    );
  } else if (size === 'lg') {
    return (
      <h2 className={`${baseFonts} text-base leading-6 ${className}`}>
        {children}
      </h2>
    );
  }

  return (
    <p className={`${baseFonts} text-base leading-6 ${className}`}>
      {children}
    </p>
  );
};

Title.defaultProps = {
  size: 'xl'
};

Title.propTypes = {
  /** Additional classes applied to title */
  className: PropTypes.string,
  /** React node children */
  children: PropTypes.node,
  /** Size: xl=h1, lg=h2, md=h3, sm=h4, xs=h5 */
  size: PropTypes.oneOf(['xl', 'lg', 'md', 'sm', 'xs'])
};

export default Title;
