const { eslint } = require('@umijs/fabric');

// 引号、双引号都可以
eslint.rules['quotes'] = 0;
eslint.rules['object-curly-spacing'] = 0;
eslint.rules['comma-dangle'] = 0;
eslint.rules['max-len'] = 0;
eslint.rules['no-trailing-spaces'] = 0;
eslint.rules['no-multiple-empty-lines'] = 0;
eslint.rules['arrow-body-style'] = 0;
eslint.rules['no-unused-vars'] = 1;
eslint.rules['jsx-curly-brace-presence'] = 0;
eslint.rules['jsx-quotes'] = 0;
eslint.rules['space-infix-ops'] = 0;
eslint.rules['react/jsx-curly-brace-presence'] = 0;
eslint.rules['import/order'] = 0;
eslint.rules['dot-notation'] = 0;
eslint.rules['no-plusplus'] = 0;
eslint.rules['no-shadow'] = 0;
eslint.rules['spaced-comment'] = 0;
eslint.rules['lines-between-class-members'] = 0;
eslint.rules['no-useless-constructor'] = 0;
eslint.rules['no-empty-function'] = 0;
eslint.rules['comma-spacing'] = 0;
eslint.rules['padded-blocks'] = 0;
eslint.rules['semi-style'] = 0;
eslint.rules['no-empty'] = 0;
eslint.rules['prefer-destructuring'] = 0;
eslint.rules['block-spacing'] = 0;
eslint.rules['no-multi-assign'] = 0;
eslint.rules['no-case-declarations'] = 0;
eslint.rules['arrow-parens'] = 0;
eslint.rules['no-param-reassign'] = 0;
eslint.rules['prefer-template'] = 0;
eslint.rules['no-console'] = 0;
eslint.rules['keyword-spacing'] = 0;
eslint.rules['space-before-blocks'] = 0;
eslint.rules['arrow-spacing'] = 0;
eslint.rules['array-callback-return'] = 0;
eslint.rules['no-multi-spaces'] = 0;

module.exports = {
  ...eslint,
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
  }
};
