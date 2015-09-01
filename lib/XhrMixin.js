'use strict';

var PreloadedData = require('./PreloadedData');

var assign = require('object-assign');
var mapValues = require('lodash.mapvalues');
var performXhr = require('./performXhr');
var stringifyXhrSpec = require('./stringifyXhrSpec');

var EMPTY_RESPONSE = {
  err: null,
  loading: true,
  body: {},
};

var XhrMixin = {
  getInitialState: function() {
    return {xhrs: {}};
  },

  componentWillMount: function() {
    this._mountComplete = false;

    try {
      this.prevXhrs = {};

      var specs = this.getXhrs();
      var xhrs = {};

      for (var xhrName in specs) {
        var spec = specs[xhrName];
        var specString = stringifyXhrSpec(spec);
        var preloadedData = PreloadedData.get(specString);
        if (preloadedData) {
          this.prevXhrs[xhrName] = specString;
          xhrs[xhrName] = {
            err: null,
            loading: false,
            body: preloadedData,
          };
        } else {
          xhrs[xhrName] = EMPTY_RESPONSE;
        }
      }

      this._universalSetState(function(state) {
        return {xhrs: xhrs};
      });

      // TODO: move back to didMount?
      this._fetch();
    } finally {
      this._mountComplete = true;
    }
  },

  _universalSetState: function(cb) {
    // work around for https://github.com/facebook/react/issues/3620
    // this may ONLY be called directly from lifecycle methods, not from callbacks
    if (this._mountComplete) {
      this.setState(cb);
    } else {
      assign(this.state, cb(this.state));
    }
  },

  componentDidUpdate: function() {
    this._fetch();
  },

  _fetch: function() {
    var stateUpdates = {};
    var xhrs = this.getXhrs();
    var prevXhrs = this.prevXhrs;
    this.prevXhrs = mapValues(xhrs, stringifyXhrSpec);

    for (var xhrName in xhrs) {
      if (this.prevXhrs[xhrName] === prevXhrs[xhrName]) {
        // Nothing to do for this xhr
        continue;
      }

      stateUpdates[xhrName] = EMPTY_RESPONSE;

      performXhr(xhrs[xhrName], function(xhrName, xhrItem, err, body) {
        // nextTick() guards against a race with the loading state if the user
        // overrides with a performXhr() that calls the callback synchronously.
        process.nextTick(function() {
          var specString = stringifyXhrSpec(xhrItem);
          if (this.prevXhrs[xhrName] !== specString || !this.isMounted()) {
            // out of date
            return;
          }

          var stateUpdate = {};
          stateUpdate[xhrName] = {
            err: err,
            loading: false,
            body: body
          };
          if (xhrItem.onComplete) {
            xhrItem.onComplete(err, body);
          }

          this.setState(function(state) {
            return {
              xhrs: assign({}, state.xhrs, stateUpdate),
            };
          });
        }.bind(this));
      }.bind(this, xhrName, xhrs[xhrName]));
    }

    for (xhrName in this.state.xhrs) {
      if (!xhrs.hasOwnProperty(xhrName) && this.state.xhrs[xhrName] !== null) {
        stateUpdates[xhrName] = null;
      }
    }

    if (Object.keys(stateUpdates).length > 0) {
      this._universalSetState(function(state) {
        return {
          xhrs: assign({}, state.xhrs, stateUpdates),
        };
      });
    }
  },
};

module.exports = XhrMixin;
