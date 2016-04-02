'use strict';

var PreloadedData = require('./PreloadedData');
var ReactDOM = require('react-dom');

function render(element, preloadedData, domNode, cb) {
  PreloadedData.withPreloadedData(preloadedData, function() {
    ReactDOM.render(element, domNode, cb);
  });
}

module.exports = render;
