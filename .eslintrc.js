// // http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    "main": {
      "presets": ["es2015", "stage-0"]
    },
    "renderer": {
      "presets": [
        ["es2015", { "modules": false }],
        "stage-0"
      ]
    }
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  'rules': {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}

// module.exports = {
//   root: true,
//   parser: 'babel-eslint',
//   parserOptions: {
//     sourceType: 'module'
//   },
//   env: {
//     browser: true,
//     node: true
//   },
//   extends: 'standard',
//   plugins: [
//     'html'
//   ],
//   'rules': {
//     // allow paren-less arrow functions
//     'arrow-parens': 0,
//     // allow async-await
//     'generator-star-spacing': 0,
//     // allow debugger during development
//     'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
//   }
// }