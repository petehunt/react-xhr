'use strict';

var assign = require('object-assign');
var invariant = require('invariant');

var _performXhr = null;

function performXhr() {
  invariant(_performXhr, 'performXhr not injected yet');

  return _performXhr.apply(this, arguments);
}

assign(performXhr, {
  injection: {
    injectPerformXhr: function(performXhr) {
      invariant(_performXhr === null, 'Already injected performXhr');
      invariant(typeof performXhr === 'function', 'performXhr() must be a function');
      _performXhr = performXhr;
    },

    overridePerformXhr: function(nextPerformXhr) {
      _performXhr = null;
      performXhr.injection.injectPerformXhr(nextPerformXhr);
    },
  },

  withPerformXhr: function(nextPerformXhr, cb) {
    var prevPerformXhr = _performXhr;
    _performXhr = nextPerformXhr;
    try {
      return cb();
    } finally {
      _performXhr = prevPerformXhr;
    }
  },
});

module.exports = performXhr;
