/* istanbul ignore file */
/**
 * @file These are the needed steps to convert colors in our SVG icons
 *
 * to be used as <Delete style={{filter: `${toBlack} ${blackToWhite}`}} />
 * where <Delete /> is an svg of any color
 *
 * Steps created with this generator: https://codepen.io/sosuke/pen/Pjoqqp
 */

// Any color to black
export const toBlack = 'brightness(0) saturate(100%)';

// From black to white
export const blackToWhite =
  'invert(100%) sepia(91%) saturate(38%) hue-rotate(321deg) brightness(110%) contrast(110%)';

// Black to grey500
export const blackToGrey500 =
  'invert(42%) sepia(23%) saturate(354%) hue-rotate(182deg) brightness(94%) contrast(85%)';

export const blackToGrey200 =
  'invert(95%) sepia(2%) saturate(3211%) hue-rotate(182deg) brightness(91%) contrast(79%)';

// Black to red500
export const blackToRed500 =
  'invert(18%) sepia(26%) saturate(6877%) hue-rotate(319deg) brightness(91%) contrast(96%)';

export const blackToBlue500 =
  ' invert(39%) sepia(17%) saturate(3351%) hue-rotate(200deg) brightness(95%) contrast(89%)';
