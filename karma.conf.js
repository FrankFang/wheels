module.exports = function(config) {
  config.set({
    frameworks: ['mocha'],

    files: [
      {pattern: 'test/**/*.js', watched: false},
    ],
    webpackMiddleware: {
      stats: 'errors-only'
    },
    preprocessors: {
      // add webpack as preprocessor
      'test/**/*.js': ['webpack'],
    },
    plugins : [
      'karma-mocha',
      'karma-chrome-launcher',
      'karma-webpack',
    ],
    browsers: ['Chrome'], // You may use 'ChromeCanary' or 'Chromium' as well
  })
}
