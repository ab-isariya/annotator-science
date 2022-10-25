module.exports = {
  env: {
    //About Env: https://eslint.org/docs/user-guide/configuring/language-options#specifying-environments
    browser: true,
    node: true,
    es2021: true,
    jest: true
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'], //About extend: https://eslint.org/docs/user-guide/configuring/configuration-files#extending-configuration-files
  parserOptions: {
    //Documentation on Parser: https://eslint.org/docs/user-guide/configuring/plugins#specifying-parser
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  settings: {
    //Default settings from https://github.com/yannickcr/eslint-plugin-react#configuration
    react: {
      createClass: 'createReactClass', // Regex for Component Factory to use,
      // default to "createReactClass"
      pragma: 'React', // Pragma to use, default to "React"
      fragment: 'Fragment', // Fragment to use (may be a property of <pragma>), default to "Fragment"
      version: 'detect', // React version. "detect" automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      // default to latest and warns if missing
      // It will default to "detect" in the future
      flowVersion: '0.53' // Flow version
    },
    propWrapperFunctions: [
      // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
      'forbidExtraProps',
      {property: 'freeze', object: 'Object'},
      {property: 'myFavoriteWrapper'}
    ],
    componentWrapperFunctions: [
      // The name of any function used to wrap components, e.g. Mobx `observer` function. If this isn't set, components wrapped by these functions will be skipped.
      'observer', // `property`
      {property: 'styled'}, // `object` is optional
      {property: 'observer', object: 'Mobx'},
      {property: 'observer', object: '<pragma>'} // sets `object` to whatever value `settings.react.pragma` is set to
    ],
    linkComponents: [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      'Hyperlink',
      {name: 'Link', linkAttribute: 'to'}
    ]
  },
  globals: {
    React: 'writable' //Sets react as a global class to escape the react import linter errors
  },
  plugins: ['react', 'import'], //Support for react
  rules: {
    indent: ['warn', 2], //Indentation should be 4 spaces expectation, no tabs
    'linebreak-style': ['error', 'unix'], //Linebreak style should be unix not windows
    quotes: ['error', 'single'], //Single quotes in strings always
    semi: ['error', 'always'], //Always have semi colons at the ends
    'no-console': 'error', //No consoles in our code ever
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'react/display-name': 'warn',
    'react/no-unescaped-entities': 0, //<- Don't worry about the use of characters like commas (')
    'no-useless-catch': 'off' //<- Turn of "useless try catch"
  }
};
