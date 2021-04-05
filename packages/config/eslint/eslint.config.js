module.exports = {
  extends: ['airbnb-typescript', 'prettier'],
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  rules: {
    'comma-dangle': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.spec.tsx', '**/*.stories.tsx'] },
    ],
    '@typescript-eslint/semi': 0,
    '@typescript-eslint/comma-dangle': 0,
    'no-console': 0,
  },
}
