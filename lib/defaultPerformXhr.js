'use strict';

var xhr = require('xhr');

function defaultPerformXhr(spec, cb) {
  // This is really dumb, but xhr() deeply mutates the spec
  spec = JSON.parse(JSON.stringify(spec));
  xhr(spec, function(err, resp, body) {
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }
    cb(err, body);
  });
}

module.exports = defaultPerformXhr;
