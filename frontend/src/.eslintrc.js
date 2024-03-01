module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard',
    'plugin:react/recommended'
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'react'
  ],
  rules: {
    'no-unused-vars': 'warn',
    'react/prop-types': 'warn',
    eqeqeq: 'warn',
    'multiline-ternary': 'warn',
    'no-tabs': 'warn',
    'no-mixed-spaces-and-tabs': 'warn'
  }
}
