/**
 * Buttons
 * figma: https://www.figma.com/file/d2iT8aM5wR0AN6ZHukOu5C/TAT-Style-Sheet-and-Master-Components?node-id=1986%3A17
 */
import React from 'react';
import PropTypes from 'prop-types';

const ButtonGroup = ({className, children}) => {
  return (
    <div
      className={`flex flex-row items-stretch overflow-hidden border-grey-500 border rounded-md h-full ${className}`}>
      {children}
    </div>
  );
};

ButtonGroup.propTypes = {
  //Group classname
  className: PropTypes.string,
  //Children nodes rendered inside
  children: PropTypes.node
};

export default ButtonGroup;
