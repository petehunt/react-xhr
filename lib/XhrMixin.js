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
    this.prevXhrs = {};

    var specs = this.getXhrs();
    var xhrs = {};

    for (var xhrName in specs) {
      var spec = specs[xhrName];
      var preloadedData = PreloadedData.get(spec);
      if (preloadedData) {
        this.prevXhrs[xhrName] = stringifyXhrSpec(spec);
        xhrs[xhrName] = {
          err: null,
          loading: false,
          body: preloadedData,
        };
      } else {
        xhrs[xhrName] = EMPTY_RESPONSE;
      }
    }

    // work around for https://github.com/facebook/react/issues/3620
    assign(this.state, {
      xhrs: xhrs,
    });

    // TODO: move back to didMount?
    this._fetch();
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
      this.setState(function(state) {
        return {
          xhrs: assign({}, state.xhrs, stateUpdates),
        };
      });
    }
  },
};

module.exports = XhrMixin;
