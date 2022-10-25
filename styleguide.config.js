const path = require('path');

module.exports = {
  components: ['src/ui/**/*.js'], //'src/dataComponents/**/*.js'
  //  alias a bunch of commonly used src/ folders
  moduleAliases: {
    '@assets': path.resolve(__dirname, './src/assets'),
    '@modules': path.resolve(__dirname, './src/modules'),
    '@pages': path.resolve(__dirname, './src/pages'),
    '@utils': path.resolve(__dirname, './src/utils')
  },
  sections: [
    {
      name: 'Basic',
      components: 'src/modules/ui/**/*.js'
    }
  ]
};
