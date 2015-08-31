'use strict';

var invariant = require('invariant');
var stringifyXhrSpec = require('./stringifyXhrSpec');

var data = {};

var PreloadedData = {
  get: function(specString) {
    return data[specString];
  },

  withPreloadedData: function(nextDataItems, cb) {
    var prevData = data;
    data = {};

    try {
      invariant(Array.isArray(nextDataItems), 'nextDataItems should be an array');
      nextDataItems.forEach(function(item) {
        invariant(item.length === 2, 'nextDataItems should contain only pairs');
        var specString = stringifyXhrSpec(item[0]);
        invariant(
          !data.hasOwnProperty(specString),
          'nextDataItems contained multiple values for spec: %s',
          specString
        );
        data[specString] = item[1];
      });
      return cb();
    } finally {
      data = prevData;
    }
  },
};

module.exports = PreloadedData;
