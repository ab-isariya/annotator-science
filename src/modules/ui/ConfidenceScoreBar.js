/**
 * @file Entity Type Labels
 * figma: https://www.figma.com/file/DdbiQRZHR33IX83pYJwsNU/2021-Master-Components?node-id=2841%3A177
 */

import React, {forwardRef} from 'react';
import PropTypes from 'prop-types';
import isNil from 'lodash/isNil';

import Bar from '@ui/Bar';
import confidenceStyles from '@styles/ConfidenceStyles';
import {ConfidenceScore} from '@utils/constants';

/**
 * Displays entity types with their corresponding backgrounds
 */
const ConfidenceScoreBar = forwardRef(({size, type}, ref) => {
  // If size is not given, make it 100%
  if (isNil(size)) {
    size = 100;
  }

  const classes = 'capitalize font-inter font-normal text-xs';
  const _type = String(type).toLowerCase();

  const background = confidenceStyles[_type].activeBg;
  const textColor = confidenceStyles[_type].textColor;
  const label = ConfidenceScore[_type].label;

  return (
    <Bar
      bgColor={`bg-${background}`}
      padding="px-1.5 py-1"
      size={size}
      ref={ref}>
      <span className={`${classes} text-${textColor}`}>{label}</span>
    </Bar>
  );
});

ConfidenceScoreBar.displayName = 'ConfidenceScoreBar';

ConfidenceScoreBar.propTypes = {
  /** Width of color background. If undefined, it will be 100% */
  size: PropTypes.number,
  /** Concept type */
  type: PropTypes.oneOf(
    Object.keys(ConfidenceScore).map((k) => ConfidenceScore[k].score_cat)
  )
};

export default ConfidenceScoreBar;
