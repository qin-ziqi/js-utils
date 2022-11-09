module.exports = {
  printWidth: 100,
  tabWidth: 4,
  useTabs: false,
  semi: true,
  vueIndentScriptAndStyle: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'es5', // 对象最后一行加逗号，避免新增属性引起两行git修改记录
  jsxSingleQuote: false,
  arrowParens: 'always',
  insertPragma: false,
  requirePragma: false,
  proseWrap: 'never',
  htmlWhitespaceSensitivity: 'strict',
  endOfLine: 'lf',
  rangeStart: 0,
  overrides: [
    {
      files: ['*.less', '*.css'],
      options: {
        singleQuote: false,
      },
    },
  ],
};
