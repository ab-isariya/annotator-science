/**
 * Confidence score
 * figma: https://www.figma.com/file/d2iT8aM5wR0AN6ZHukOu5C/TAT-Style-Sheet-and-Master-Components?node-id=411%3A0
 */
import React from 'react';
import PropTypes from 'prop-types';

import {ConfidenceScore as ConfidenceConstants} from '@utils/constants';
import confidenceStyles from '@styles/ConfidenceStyles';
import Tooltip from '@modules/ui/Tooltip';

/**
 * Label with specific colors and pie chart to display the model confidence
 * score, including tooltips with a description of what the text in the
 * tag means
 */
const ConfidenceScoreLabel = ({type, className}) => {
  let _type = String(type).toLowerCase();

  //Render the correct tooltip text, or just render the type itself.
  const tooltipContent = ConfidenceConstants[_type].tooltipText;
  //Render the correct icon, or just render the type itself.
  const icon = confidenceStyles[_type].icon;

  return (
    <Tooltip
      arrow={false}
      followCursor={true}
      size="small"
      content={tooltipContent}>
      <span className={`${className}`}>{icon}</span>
    </Tooltip>
  );
};

ConfidenceScoreLabel.propTypes = {
  // Extraneous classnames
  className: PropTypes.string,
  //Model confidence type to use (see ConfidenceScore in constants.js)
  // NOTE: If provided, will override score
  type: PropTypes.oneOf(
    Object.keys(ConfidenceConstants).map(
      (k) => ConfidenceConstants[k].score_cat
    )
  )
};

export default ConfidenceScoreLabel;
