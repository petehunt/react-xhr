'use strict';

var invariant = require('invariant');

function stringifyXhrSpec(spec) {
  invariant(typeof spec === 'object', 'spec must be an object');
  if (!spec) {
    return null;
  }

  var keys =  Object.keys(spec);
  keys.sort();
  var rv = {};
  keys.forEach(function(key) {
    rv[key] = spec[key];
  });
  return JSON.stringify(rv);
}

module.exports = stringifyXhrSpec;
