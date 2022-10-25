/**
 * @file Entity Type Labels
 * figma: https://www.figma.com/file/DdbiQRZHR33IX83pYJwsNU/2021-Master-Components?node-id=2841%3A177
 */

import React, {forwardRef} from 'react';
import PropTypes from 'prop-types';

import isNil from 'lodash/isNil';

import Bar from '@ui/Bar';
import typeStyles from '@styles/TypeStyles';

/**
 * Displays entity types with their corresponding backgrounds
 */
const TypeTag = forwardRef(({size, type}, ref) => {
  // If size is not given, make it 100%
  if (isNil(size)) {
    size = 100;
  }
  const classes = 'capitalize font-inter font-normal text-xs';

  return (
    <Bar
      bgColor={`bg-${typeStyles[type]['activeBg']}`}
      padding="px-1.5 py-0.5"
      ref={ref}
      size={size}>
      {typeStyles[type]['icon']}&nbsp;
      <span className={`${classes} text-${typeStyles[type]['textColor']}`}>
        {type}
      </span>
    </Bar>
  );
});

TypeTag.displayName = 'TypeTag';

TypeTag.propTypes = {
  /** Width of color background. If undefined, it will be 100% */
  size: PropTypes.number,
  /** Concept type */
  type: PropTypes.oneOf(Object.keys(typeStyles)).isRequired
};

export default TypeTag;
