'use strict';

var PreloadedData = require('./PreloadedData');
var React = require('react');

function render(element, preloadedData, domNode, cb) {
  PreloadedData.withPreloadedData(preloadedData, function() {
    React.render(element, domNode, cb);
  });
}

module.exports = render;
