module.exports = {
  plugins: ['prettier'],
  extends: ['@tencent/eslint-config-tencent', 'plugin:prettier/recommended', 'prettier'],
  rules: {
    'prettier/prettier': 'error', // 被prettier标记的地方抛出错误信息
    // 以下是自定义的规则
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off', // 非开发模式禁用debugger
    'no-underscore-dangle': 'off',
    // 'operator-linebreak': 'error',
    // Windows换行符 'rc'
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'new-cap': 'off',
    'no-unused-vars': 'off',
    camelcase: 'off',
  },
  overrides: [
    {
      // enable the rule specifically for TypeScript files
      files: ['*.ts', '*.tsx', '*.js'],
    },
  ],
};
