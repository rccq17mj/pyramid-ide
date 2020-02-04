const { strictEslint } = require('@umijs/fabric');

// 引号、双引号都可以
strictEslint.rules['quotes'] = 0;
strictEslint.rules['object-curly-spacing'] = 0;
strictEslint.rules['comma-dangle'] = 0;
strictEslint.rules['max-len'] = 0;
strictEslint.rules['no-trailing-spaces'] = 0;
strictEslint.rules['no-multiple-empty-lines'] = 0;
strictEslint.rules['arrow-body-style'] = 0;
strictEslint.rules['no-unused-vars'] = 1;
strictEslint.rules['jsx-curly-brace-presence'] = 0;
strictEslint.rules['jsx-quotes'] = 0;
strictEslint.rules['space-infix-ops'] = 0;
strictEslint.rules['react/jsx-curly-brace-presence'] = 0;
strictEslint.rules['import/order'] = 0;
strictEslint.rules['dot-notation'] = 0;

module.exports = {
  ...strictEslint,
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
  }
};
