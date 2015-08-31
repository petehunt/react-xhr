'use strict';

var PreloadedData = require('./PreloadedData');
var React = require('react');

var invariant = require('invariant');
var performXhr = require('./performXhr');

// TODO: multiple passes should be considered an antipattern, but do we want to
// support it anyway?
function renderToString(element, performBulkXhrs, cb) {
  var requests = {};
  var counts = 0;

  function logPerformXhr(spec) {
    // cb can be thrown away since we aren't actually rendering.
    requests[counts++] = spec;
  }

  performXhr.withPerformXhr(logPerformXhr, function() {
    React.renderToString(element);
  });

  performBulkXhrs(requests, function(responses) {
    try {
      var dataItems = [];
      for (var key in requests) {
        invariant(
          responses.hasOwnProperty(key),
          'You must include a response for every key (missed: %s)',
          key
        );

        dataItems.push([requests[key], responses[key]]);
      }

      PreloadedData.withPreloadedData(dataItems, function() {
        var markup = React.renderToString(element);
        cb(null, {
          markup: markup,
          preloadedData: dataItems,
        })
      });
    } catch (e) {
      cb(e);
    }
  });
}

module.exports = renderToString;
