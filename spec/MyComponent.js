'use strict';

var React = require('react');
var ReactXhr = require('../');

var MyComponent = React.createClass({
  mixins: [ReactXhr.Mixin],

  getXhrs: function() {
    return {hello: {path: '/get' + this.props.thing}};
  },

  render: function() {
    return React.createElement(
      'span',
      {},
      'Hello, ' + this.state.xhrs.hello.body.name
    );
  },
});

module.exports = MyComponent;
