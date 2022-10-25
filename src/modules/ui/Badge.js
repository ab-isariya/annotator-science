/**
 * @file Badge
 * figma: https://www.figma.com/file/d2iT8aM5wR0AN6ZHukOu5C/TAT-Style-Sheet-and-Master-Components?node-id=1987%3A0
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Badge: short text or component inside a pill
 */
const Badge = ({disabled, className, children}) => {
  // Inter, 14px text, line-height 20x, padding x 6px, border-radius 2px
  // Added a small margin
  const commonClasses = `mx-0.5 px-1.5 font-inter lg:text-sm lg:leading-5 rounded ${className}`;
  return (
    <>
      {disabled ? (
        <span className={`${commonClasses} bg-grey-100 text-grey-300`}>
          {children}
        </span>
      ) : (
        <span className={`${commonClasses} bg-blue-500 text-white`}>
          {children}
        </span>
      )}
    </>
  );
};

Badge.defaultProps = {
  disabled: false
};

Badge.propTypes = {
  /** Instead the blue background, use a gray background */
  disabled: PropTypes.bool,
  // Tailwind Classes
  className: PropTypes.string,
  //React node children
  children: PropTypes.node
};

export default Badge;
