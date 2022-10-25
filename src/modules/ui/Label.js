import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component to display label elements inside Cards
 */
const Label = ({primary, secondary, small, children, className}) => {
  // font-size: 14px, line-height: 20px;
  const defaultSizeLineHeight = 'text-sm leading-5';
  // small size, font-size: 12px, line-height: 16px;
  const smallSizeLineHeight = 'text-xs leading-4';

  let classes = `block font-inter uppercase ${className}`;
  // Add text color
  if (primary) {
    classes += ' text-grey-900';
  }
  if (secondary) {
    classes += ' text-grey-500';
  }
  // Add font size
  classes += small ? ` ${smallSizeLineHeight} ` : ` ${defaultSizeLineHeight} `;

  return <span className={classes}>{children}</span>;
};

Label.propTypes = {
  /** black font */
  primary: PropTypes.bool,
  /** grey font */
  secondary: PropTypes.bool,
  /** if true 12px/16px, else 14px/20px */
  small: PropTypes.bool,
  //React node children
  children: PropTypes.node,
  // Tailwind Classes
  className: PropTypes.string
};

export default Label;
