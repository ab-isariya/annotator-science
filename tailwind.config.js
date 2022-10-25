const plugin = require('tailwindcss/plugin');
const map = require('lodash/map');
const flatten = require('lodash/flatten');
const isPlainObject = require('lodash/isPlainObject');
const theme = require('./src/modules/ui/theme');

module.exports = {
  purge: ['./src/**/*.html', './src/**/*.js', './src/**/*.jsx'],
  important: true, //NOTE(Rejon): The important option lets you control whether or not Tailwind's utilities should be marked with !important
  theme: {
    colors: theme.colors,
    backdropFilter: {
      // defaults to {}
      none: 'none',
      blur: 'blur(20px)'
    },
    backgroundPosition: {
      'holofoil-expand-blue': '11%'
    },
    backgroundSize: {
      'holofoil-expand': '500%'
    },
    borderColor: (theme) => ({
      ...theme('colors'),
      transparent: 'transparent'
    }),
    // Specified here instead of theme.js because I want to reference the color
    boxShadow: {
      document: `0px 0px 10px ${theme.colors.grey['300']}`,
      header: `0px 1px 2px ${theme.colors.grey['200']}`,
      left: `1px 0px 2px ${theme.colors.grey['200']}`,
      none: 'none',
      right: `-1px 0px 2px ${theme.colors.grey['200']}`,
      secondaryButton: `0px 0px 4px ${theme.colors.red['500']}`,
      sm: '0px 1px 2px rgba(0, 0, 0, 0.25)'
    },
    filter: {
      // defaults to {}
      none: 'none',
      grayscale: 'grayscale(1)',
      invert: 'invert(1)',
      sepia: 'sepia(1)',
      active: `drop-shadow(0px 0px 4px ${theme.colors.blue['500']})`
    },
    ring: {
      focus: 'box-shadow: 0px 0px 4px #4D64D2'
    },
    fontFamily: theme.fontFamily,

    // Add to existing themes
    extend: {
      backgroundImage: () => ({
        holofoil:
          'linear-gradient(76deg, rgba(177,140,222,1) 0%, rgba(148,142,232,1) 7%, rgba(89,145,237,1) 15%, rgba(66,167,221,1) 24%, rgba(101,190,208,1) 33%, rgba(140,205,207,1) 42%, rgba(163,201,184,1) 51%, rgba(182,205,175,1) 56%, rgba(204,204,162,1) 61%, rgba(220,198,152,1) 65%, rgba(233,185,148,1) 70%, rgba(239,173,150,1) 74%, rgba(240,162,156,1) 81%, rgba(234,149,163,1) 87%, rgba(205,133,176,1) 93%, rgba(170,134,174,1) 98%)',
        holofoil_blue:
          'linear-gradient(to bottom, #8ec7f4 0%,#8dc5f5 1%,#8ec7f3 1%,#85c9f2 2%,#82cbf3 2%,#7fc5f3 3%,#7ecbf5 3%,#7ecbf3 4%,#72ccf0 5%,#74caf3 6%,#75d0f2 7%,#73cdef 7%,#79d0f3 8%,#72d1f4 9%,#6cd4f1 9%,#6fd2f2 10%,#6cd3f2 11%,#6fd5f2 11%,#6dd2f2 12%,#69d4ef 12%,#71d3f2 13%,#66d5ee 14%,#72d3ee 15%,#6dd3ef 15%,#73d3ee 16%,#6bd1f0 17%,#72d7f0 17%,#77d5ee 18%,#75d5ee 20%,#7ad3ee 20%,#76d0eb 22%,#7bd3eb 23%,#7bd1ed 23%,#76d1ec 24%,#7bd2ed 25%,#79d0ea 25%,#81cfeb 26%,#82ceea 26%,#7fd1ea 27%,#7dd0e9 27%,#7dc8e8 28%,#83cfe8 29%,#80cae9 30%,#84cce7 31%,#81c9e7 31%,#85c8e8 33%,#82c8e6 34%,#85c3e7 34%,#86c3e4 35%,#81c0e5 35%,#86bfe3 36%,#85bfe5 36%,#89bfe4 37%,#8ab8e3 38%,#8fb7e4 39%,#8bb7e3 39%,#8ab3e3 40%,#8bb2e6 40%,#8cb2e3 41%,#89a9e5 42%,#8ca1e9 44%,#889de8 44%,#889bea 45%,#859feb 45%,#7e92ec 46%,#7996ee 47%,#7b8cf1 48%,#7b8df1 49%,#748ef0 49%,#728cf1 50%,#6d8ff5 50%,#6e8bf3 51%,#6988f7 51%,#6489f6 52%,#6588f6 53%,#5e8bf6 53%,#638cf6 54%,#618cf6 54%,#588ef6 55%,#5893f7 55%,#5994f4 56%,#6194f4 56%,#5999f6 57%,#5a95f2 58%,#5f98f1 58%,#5c9df4 59%,#5e9df1 60%,#639df2 60%,#62a7ed 62%,#72a5ed 63%,#6ba7e9 64%,#7aa9ea 65%,#74ace8 65%,#79a8e7 66%,#84ace5 66%,#7fabe4 67%,#8ba8e0 68%,#8eaae0 69%,#95afdb 69%,#9dabd9 71%,#9cadd7 72%,#a0a8d6 72%,#a9add4 73%,#a9acd0 74%,#aea9ca 74%,#b3aacc 75%,#b8a9c5 75%,#b7a3c4 76%,#bba6be 77%,#baa4bc 77%,#c5a4b5 79%,#cd9eac 80%,#cb98ad 80%,#cc9aa2 82%,#d0929f 82%,#d090a1 83%,#d0909c 83%,#d58ba0 84%,#d68d9d 85%,#d78b9e 86%,#da849e 87%,#d67f9b 87%,#d97d9e 88%,#da83a4 88%,#d9819f 89%,#d87ca3 89%,#da7fa2 90%,#d77ca5 91%,#d87ea3 91%,#d97fa6 92%,#d775a4 92%,#d480a6 93%,#d37aa9 94%,#cf80a5 95%,#cc7aa8 96%,#ca83a8 96%,#c77fa6 97%,#bf7ca8 98%,#c081a7 98%,#bc7caa 99%,#b980a9 99%,#b47fad 100%)'
      }),
      dropShadow: {
        'focus-dark': '0px 0px 4px #3C4257',
        'focus-button': '0px 0px 4px #4D64D2',
        'focus-red': '0px 0px 4px #A41C4E'
      },
      zIndex: {
        0: '0',
        1: '1',
        2: '2',
        3: '3',
        '-1': '-1',
        '-2': '-2',
        '-3': '-3',
        '-4': '-4',
        '-5': '-5'
      },
      backgroundColor: () => ({
        transparent: 'transparent'
      }),
      fontSize: () => ({
        xxs: '0.625rem'
      }),
      lineHeight: () => ({
        // Line height for document view
        'extra-loose': '3'
      }),

      margin: {
        19: '4.75rem'
      },
      maxWidth: () => ({
        icon48: '3rem',
        docView: '700px',
        docLeftSidebar: '64px'
      }),
      minWidth: {
        3.5: '0.875rem',
        4: '1rem',
        6.5: '1.875rem',
        '1/3': '33.333333%',
        '2/5': '40%',
        docLeftSidebar: '64px'
      },
      minHeight: {
        annoCard: '154px',
        docView: 'calc(100vh - 1.25rem - 75px)'
      },
      padding: () => ({
        docX: '3.125rem',
        19: '4.75rem'
      }),
      width: () => ({
        65: '268px',
        66: '288px',
        83: '22.5rem',
        74: '19rem'
      }),
      // ring: {
      //   'focus': 'box-shadow: 0px 0px 4px #4D64D2'
      // },
      animation: {
        redpulse: 'redpulse .5s linear',
        greenpulse: 'greenpulse .5s linear'
      },
      keyframes: {
        redpulse: {
          '0%, 100%': {filter: 'drop-shadow(0px 0px 0px #A41C4E)'},
          '50%': {filter: 'drop-shadow(0px 0px 4px #A41C4E)'}
        },
        greenpulse: {
          '0%, 100%': {filter: 'drop-shadow(0px 0px 0px #1EA672)'},
          '50%': {filter: 'drop-shadow(0px 0px 4px #1EA672)'}
        }
      }
    }
  },
  variants: {
    backdropFilter: ['responsive'],
    dropShadow: ['focus'],
    backgroundColor: ['active', 'checked', 'hover', 'disabled', 'focus'],
    borderColor: [
      'active', // This I added
      'checked', // This I added
      'dark',
      'focus',
      'focus-within',
      'group-hover',
      'hover',
      'responsive'
    ],
    textColor: ['disabled'],
    boxShadow: ['focus', 'active'],
    filter: ['responsive', 'focus', 'active'], // defaults to ['responsive']
    outline: ['hover', 'active', 'focus'],
    extend: {
      margin: ['last'],
      textColor: ['checked'],
      backgroundColor: ['checked'],
      borderColor: ['checked']
    }
  },
  // custom plugin for pseudo-elements:
  // https://github.com/tailwindlabs/tailwindcss/discussions/2119
  plugins: [
    plugin(({addVariant, e}) => {
      addVariant('before', ({modifySelectors, separator}) => {
        modifySelectors(({className}) => {
          return `.${e(`before${separator}${className}`)}::before`;
        });
      });
      addVariant('after', ({modifySelectors, separator}) => {
        modifySelectors(({className}) => {
          return `.${e(`after${separator}${className}`)}::after`;
        });
      });
    }),
    require('tailwindcss-pseudo-elements'),
    require('tailwindcss-filters'),
    require('@tailwindcss/forms'),
    plugin(({addUtilities}) => {
      const contentUtilities = {
        '.content': {
          content: 'attr(data-content)'
        },
        '.content-before': {
          content: 'attr(data-before)'
        },
        '.content-after': {
          content: 'attr(data-after)'
        },
        '.empty-content': {
          content: '\'\''
        }
      };

      addUtilities(contentUtilities, ['before', 'after']);
    }),
    plugin(({addUtilities}) => {
      //NOTE(Rejon): This extends the 'line-through' class to have 2px weight based on design patterns.
      const extendLineThrough = {
        '.line-through': {
          textDecoration: 'line-through',
          'text-decoration-thickness': '2px'
        }
      };

      addUtilities(extendLineThrough);
    }),
    //NOTE(Rejon): This is adding support for text-decoration-color
    //See this for more info:https://github.com/tailwindlabs/tailwindcss/discussions/2050
    plugin(({addUtilities, e, theme, variants}) => {
      const colors = theme('colors', {});
      const decorationVariants = variants('textDecoration', []);

      //Flatten a map that has the possibility of returning
      //an array of objects OR arrays into JUST an array of objects.
      const textDecorationColorUtility = flatten(
        map(colors, (color, name) => {
          //Map the colors object keys
          if (isPlainObject(colors[name])) {
            //Check if the value of the current color is an object or not
            //It is an object, map through it's key/values and output (example)'decoration-color-grey-200`
            return map(colors[name], (_color, _name) => {
              return {
                //Return a class with name and color number.
                [`.decoration-color-${e(name)}-${_name}`]: {
                  textDecorationColor: `${_color}`
                }
              };
            });
          } //Value of current color is NOT an object
          else {
            //Return a class with only color name.
            return {
              [`.decoration-color-${e(name)}`]: {
                textDecorationColor: `${color}`
              }
            };
          }
        })
      );

      addUtilities(textDecorationColorUtility, decorationVariants);
    }),
    require('@tailwindcss/line-clamp')
  ]
};
