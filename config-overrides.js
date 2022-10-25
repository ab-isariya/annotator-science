const {override, addPostcssPlugins, addWebpackAlias} = require('customize-cra');
const path = require('path');

module.exports = override(
  addPostcssPlugins([require('tailwindcss'), require('autoprefixer')]),
  addWebpackAlias({
    ['@assets']: path.resolve(__dirname, './src/assets'),
    ['@document']: path.resolve(__dirname, './src/modules/document'),
    ['@form']: path.resolve(__dirname, './src/modules/form'),
    ['@modules']: path.resolve(__dirname, './src/modules'),
    ['@pages']: path.resolve(__dirname, './src/pages'),
    ['@styles']: path.resolve(__dirname, './src/styles'),
    ['@svgs']: path.resolve(__dirname, './src/assets/svgs'),
    ['@ui']: path.resolve(__dirname, './src/modules/ui'),
    ['@user']: path.resolve(__dirname, './src/modules/user'),
    ['@utils']: path.resolve(__dirname, './src/modules/utils'),
    ['@widgets']: path.resolve(__dirname, './src/modules/widgets'),
    ['@config']: path.resolve(__dirname, './src/config.js')
  })
);
