// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    autoWatch: false,
    basePath: '',
    browsers: [
      'ChromeHeadless'
    ],
    client: {
      clearContext: false
    },
    colors: true,
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage/task-boards-ui'),
      fixWebpackSourcePaths: true,
      reports: [
        'html',
        'lcovonly',
        'text-summary'
      ]
    },
    frameworks: [
      '@angular-devkit/build-angular',
      'jasmine'
    ],
    logLevel: config.LOG_INFO,
    plugins: [
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-chrome-launcher'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-jasmine'),
      require('karma-jasmine-html-reporter')
    ],
    port: 9876,
    reporters: [
      'kjhtml',
      'progress'
    ],
    restartOnFileChange: true,
    singleRun: true
  });
};
