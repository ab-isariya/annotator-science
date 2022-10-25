/**
 * Buttons
 * figma: https://www.figma.com/file/d2iT8aM5wR0AN6ZHukOu5C/TAT-Style-Sheet-and-Master-Components?node-id=1986%3A17
 */

import PropTypes from 'prop-types';

import classnames from 'classnames';

/**
 * Icon displaying the status of a given annotation. Note this component
 * is not positioned: the parent component must define where it goes
 */
const Button = ({
  children,
  onClick,
  red,
  dark,
  vertical,
  secondary,
  tertiary,
  blue,
  small,
  large,
  icon,
  disabled,
  className,
  ...otherProps
}) => {
  //NOTE(Rejon): We use classnames to intelligently choose which name to use for typing.
  //             this is so we can improve DX around button usage without creating multiple buttons
  //             or requiring prop="string" for type, alt, and size.
  const type =
    classnames({
      secondary,
      tertiary
    }) || 'primary';

  const alt =
    classnames({
      red,
      dark,
      vertical,
      blue
    }) || null;

  const size =
    classnames({
      small,
      large
    }) || 'medium';

  const primaryButtonClass = classnames({
    //Primary
    'bg-blue-500': !alt,
    'text-white': !disabled,
    'hover:bg-blue-600 focus:bg-blue-600 focus:drop-shadow-focus-button':
      !alt && !disabled,
    'disabled:bg-grey-100 disabled:text-grey-300': alt !== 'dark' && disabled,
    //Primary - Red
    'bg-red-600': alt === 'red',
    'hover:bg-red-700 focus:bg-red-700 focus:drop-shadow-focus-red':
      alt === 'red' && !disabled,
    //Primary - Dark
    'bg-grey-600': alt === 'dark',
    'hover:bg-grey-500 focus:bg-grey-500 focus:drop-shadow-focus-dark':
      alt === 'dark' && !disabled,
    'disabled:bg-grey-700 disabled:text-grey-400': alt === 'dark' && disabled
  });

  const secondaryButtonClass = classnames('bg-white border', {
    'border-grey-500 hover:bg-grey-50 focus:bg-grey-50 focus:drop-shadow-focus-button':
      !disabled,
    'disabled:text-grey-200 disabled:border-grey-200': disabled,
    'rounded-md px-1.5 py-1.5 flex flex-col items-center justify-center text-xs gap-y-1':
      alt === 'vertical'
  });

  const tertiaryButtonClass = classnames({
    //Tertiary
    'bg-transparent hover:bg-grey-50': !disabled && !alt,
    'focus:bg-grey-50 focus:drop-shadow-focus-button': !disabled,
    'disabled:text-grey-200': disabled,
    //Tertiary - Blue
    'bg-grey-50': alt === 'blue',
    'border border-grey-500': icon,
    'hover:bg-grey-100': alt === 'blue' && !disabled
  });

  const buttonClass = classnames(
    `filter rounded-md font-inter transition-all outline-none ${
      className || ''
    }`,
    type === 'primary' ? primaryButtonClass : null,
    type === 'secondary' ? secondaryButtonClass : null,
    type === 'tertiary' ? tertiaryButtonClass : null,
    {
      'cursor-not-allowed': disabled,
      'flex flex-row items-center gap-x-2': type !== 'vertical',
      //Font Size
      'text-sm': (size === 'medium' || size === 'small') && alt !== 'vertical',
      'text-base': size === 'large' && alt !== 'vertical',
      'text-xs': alt === 'vertical',
      //Padding
      'p-2': size === 'small',
      'p-2.5': size === 'medium',
      'p-3': size === 'large'
    }
  );

  return (
    <button
      className={buttonClass}
      disabled={disabled}
      onClick={onClick}
      {...otherProps}>
      {children}
    </button>
  );
};

Button.propTypes = {
  /** Disabled */
  disabled: PropTypes.bool,
  /** Primary button: blue */
  primary: PropTypes.bool,
  /** Secondary button: white */
  secondary: PropTypes.bool,
  /** Secondary button: grey bg */
  tertiary: PropTypes.bool,
  /** Primary alt red */
  red: PropTypes.bool,
  //** Primary alt dark */
  dark: PropTypes.bool,
  //** Secondary alt vertical */
  vertical: PropTypes.bool,
  //** Tertiary alt blue */
  blue: PropTypes.bool,
  //** Button size small */
  small: PropTypes.bool,
  //** Button size large */
  large: PropTypes.bool,
  //React node children
  children: PropTypes.node,
  //onClick callback method when a click interaction occurs
  onClick: PropTypes.func,
  //If this is only an icon or not.
  icon: PropTypes.bool,
  // Tailwind Classes
  className: PropTypes.string
};

export default Button;
