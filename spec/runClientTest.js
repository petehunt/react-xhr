'use strict';

var MyComponent = require('./MyComponent');
var React = require('react');
var ReactXhr = require('../');

function runClientTest(preloadedData) {
  var mount = document.getElementById('mnt');
  ReactXhr.render(
    React.createElement(MyComponent, {thing: 'Name'}),
    preloadedData,
    mount
  );
  return mount.innerHTML;
}

module.exports = runClientTest;
