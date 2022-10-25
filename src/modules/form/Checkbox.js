import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = React.forwardRef(
  ({children, className, ...otherProps}, ref) => {
    return (
      <label className={`flex cursor-pointer ${className}`}>
        <input
          type="checkbox"
          className={
            'cursor-pointer rounded-sm w-4 h-4  border-2 border-grey-400 checked:text-grey-400 checked:bg-grey-400 checked:border-grey-400 bg-transparent'
          }
          {...otherProps}
          ref={ref}
        />
        {children && <span className="ml-3 flex-1 ">{children}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
Checkbox.propTypes = {
  //React child nodes
  children: PropTypes.node,
  // Tailwind Classes
  className: PropTypes.string
};

export default Checkbox;
