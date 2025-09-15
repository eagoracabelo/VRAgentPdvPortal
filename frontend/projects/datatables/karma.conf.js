// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-coverage'),
      require('karma-mocha-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-jasmine-html-reporter'),
      require('karma-time-stats-reporter'),
    ],
    reporters: ['mocha', 'kjhtml', 'dots', 'time-stats'],
    timeStatsReporter: {
      reportTimeStats: true,
      binSize: 100,
      slowThreshold: 500,
      reportSlowestTests: true,
      showSlowTestRankNumber: false,
      longestTestsCount: 20,
      reportOnlyBeyondThreshold: false,
    },
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true, // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, '../../coverage/datatables'),
      subdir: '.',
      reporters: [{ type: 'lcov' }, { type: 'text-summary' }],
    },
    check: {
      global: {
        statements: 0,
        branches: 0,
        functions: 0,
        lines: 0,
      },
    },
    hostname: 'localhost',
    listenAddress: '0.0.0.0',
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadlessNoSandbox', 'FirefoxHeadless'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox', // required to run without privileges in docker
          '--user-data-dir=/tmp/chrome-test-profile',
          '--disable-web-security',
        ],
      },
      FirefoxHeadless: {
        base: 'Firefox',
        flags: ['-headless'],
      },
    },
    singleRun: true,
    restartOnFileChange: true,
    captureTimeout: 300000,
    browserDisconnectTolerance: 5,
    browserDisconnectTimeout: 300000,
    browserNoActivityTimeout: 300000,
    browserSocketTimeout: 8 * 60 * 40000,
    pingTimeout: 8 * 60 * 40000,
  });
};
