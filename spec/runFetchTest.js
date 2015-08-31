'use strict';

var MyComponent = require('./MyComponent');
var React = require('react');
var ReactXhr = require('../');

var mount = document.getElementById('root');
ReactXhr.render(
  React.createElement(MyComponent, {thing: 'Name'}),
  [[{path: '/getName'}, {name: 'test'}]],
  mount
);
expect(mount.innerHTML).toBe(
  '<span data-reactid=".0">Hello, test</span>'
);

// now fetch new data
var numFetches = 0;
ReactXhr.overridePerformXhr(function(fetch, cb) {
  numFetches++;
  expect(fetch).toEqual({path: '/getAge'});
  cb(null, {name: 'xhrs'});
  setTimeout(function() {
    expect(mount.innerHTML).toBe('<span data-reactid=".0">Hello, xhrs</span>');
    renderAge();
    setTimeout(function() {
      expect(numFetches).toBe(1);
      expect(mount.innerHTML).toBe('<span data-reactid=".0">Hello, xhrs</span>');
      done();
    }, 0);
  }, 0);
});

function renderAge() {
  ReactXhr.render(
    React.createElement(MyComponent, {thing: 'Age'}),
    [[{path: '/getName'}, {name: 'test'}]],
    mount
  );
}

renderAge();
