'use strict';

var MyComponent = require('./MyComponent');
var React = require('react');
var ReactXhr = require('../');

var jsdom = require('jsdom');
var webpackRequire = require('webpack-require');

describe('ReactXhr', function() {
  it('works', function(done) {
    ReactXhr.renderToString(
      React.createElement(MyComponent, {thing: 'Name'}),
      function(xhrs, cb) {
        expect(xhrs).toEqual({
          '0': {path: '/getName'},
        });
        cb({'0': {name: 'world'}});
      },
      function(err, result) {
        expect(err).toBe(null);
        expect(result.markup.indexOf('Hello, world')).toBeGreaterThan(-1);
        expect(result.preloadedData).toEqual([
          [{path: '/getName'}, {name: 'world'}],
        ]);

        // now run the browser version
        // we don't use the server rendered markup
        // because we want to test that react actually
        // runs correctly.
        jsdom.env(
          '<html><body><div id="mnt"></div></body></html>',
          function(errors, window) {
            webpackRequire(
              {},
              require.resolve('./runClientTest'),
              [],
              {
                window: window,
                document: window.document,
                navigator: window.navigator,
              },
              function(err, factory) {
                var runClientTest = factory();
                expect(runClientTest(result.preloadedData)).toBe(
                  '<span data-reactid=".0">Hello, world</span>'
                );
                done();
              }
            );
          }
        );
      }
    );
  });
});
