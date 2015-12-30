'use strict';

var XhrMixin = require('./XhrMixin');

var defaultPerformXhr = require('./defaultPerformXhr');
var performXhr = require('./performXhr');
var render = require('./render');
var renderToString = require('./renderToString');

var ReactXhr = {
  Mixin: XhrMixin,
  renderToString: renderToString,
  render: render,
  overridePerformXhr: performXhr.injection.overridePerformXhr,
  performXhr: performXhr,
};

// Nice default configuration.
performXhr.injection.injectPerformXhr(defaultPerformXhr);

module.exports = ReactXhr;
