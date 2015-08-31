'use strict';

var jsdom = require('jsdom');
var webpackRequire = require('webpack-require');

describe('fetching', function() {
  it('works', function(done) {
    jsdom.env(
      '<html><body><div id="root"></div></body></html>',
      function(errors, window) {
        webpackRequire(
          {},
          require.resolve('./runFetchTest'),
          [],
          {
            done: done,
            expect: expect,
            window: window,
            document: window.document,
            navigator: window.navigator,
            console: console,
            setTimeout: setTimeout,
            clearTimeout: clearTimeout,
          },
          function(err, factory) {
            factory();
          }
        );
      }
    );
  });
});
