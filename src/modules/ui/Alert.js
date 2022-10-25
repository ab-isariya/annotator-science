/**
 * @file Alerts -
 * figma https://www.figma.com/file/SiRIvWhhnpWBCA9pcclt1A/Alerts-and-Modals?node-id=27%3A78
 */
import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import {ReactComponent as Close} from '@assets/svgs/Close.svg';

const MinHeightDiv = styled.div`
  min-height: 50px;
`;

/**
 * Simple user notifications. As of Oct 13, they are styled using
 * Ant Design colors and levels.
 */
const Alert = ({icon, children, close}) => {
  let flexClasses = 'inline-flex items-center space-x-2.5';
  // padding 8px 12px, centered across cross axis and elements in extremes
  // of parent
  let spacingClasses = 'mx-0.5 px-2 py-3 justify-between';
  // Inter, 14px with 20px lh for big screens
  let fontClasses = 'font-inter lg:text-sm leading-5 text-white';

  return (
    <MinHeightDiv
      className={`bg-grey-800 rounded ${flexClasses} ${fontClasses} ${spacingClasses}`}>
      {icon && <>{icon}</>}
      <div>{children}</div>
      {close && <Close />}
    </MinHeightDiv>
  );
};

Alert.defaultProps = {
  close: true
};

Alert.propTypes = {
  /** Show close alert button */
  close: PropTypes.bool,
  /** Optional icon to be displayed */
  icon: PropTypes.node,
  /** Message level */
  level: PropTypes.oneOf(['success', 'info', 'warning', 'error']),
  //React children nodes
  children: PropTypes.node
};

export default Alert;
