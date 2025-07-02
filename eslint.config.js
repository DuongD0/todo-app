const eslintrc = require('./.eslintrc.js');

module.exports = [
  {
    files: eslintrc.files,
    languageOptions: eslintrc.languageOptions,
    plugins: eslintrc.plugins,
    rules: eslintrc.rules,
  },
];

