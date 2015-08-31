# react-xhr

## The problem

  * Data fetching for universal JS apps is hard. If you do any XHRs their data isn't present in
    the server-rendered markup.
  * Often you will want to send down the initial state of the app along with the webpage that bootstraps
    it.

## What this does not solve

  * The Relay "n+1 queries problem". It's possible for you to stumble into really inefficient data fetching patterns with this. You should build some sort of batching abstraction on top of this.
  * Client-side mutations (use Flux + this)

## How to use it

Declaratively specify your XHRs:

```js
var React = require('react');
var ReactXhr = require('react-xhr');

var MyComponent = React.createClass({
  mixins: [ReactXhr.Mixin],

  getXhrs: function() {
    return {
      userInfo: {
        url: '/user/' + this.props.username,
        method: 'get',
      },
    };
  },

  render: function() {
    return <div>User info: {this.state.xhrs.userInfo.body}</div>;
  },
});
```

`this.state.xhrs.X` has the following properties:
  * `loading`: true or false if there's a pending request
  * `err`: any error object associated with the most recent request
  * `body`: parsed JSON response returned from the server, empty object if no response yet.

This in and of itself is pretty great, but you can render it server-side if you provide your own function to resolve the fetching:

```js
// On the server

function mockXhrs(xhrs, cb) {
  // Mock backend call
  var response = {};
  for (var xhrId in xhrs) {
    var xhr = xhrs[xhrId];
    if (xhr.url.indexOf('/user/') === 0) {
      response[xhrId] = {username: xhr.url.slice('/user/'.length), isCool: true};
    }
  }
  cb(response);
}

ReactXhr.renderToString(
  <MyComponent username="floydophone" />,
  mockXhrs,
  function(err, result) {
    console.log(result.markup);
    console.log(result.preloadedData);
  }
);
```

Now that you have the markup and data that you need to preload on the client, you can render on the client
easily:

```js
// On the client

ReactXhr.render(<MyComponent username="floydophone" />, preloadedData);
```

## Advanced features

You can do other types of requests, not just xhrs. `getXhrs()` just returns a *description* of what to
fetch. You can plug in your own if you want to do fetching via websocket, batched fetching, etc.

```js
// On the client
ReactXhr.overridePerformXhr(function(xhr, cb) {
  // Read properties off of xhr (as returned from getXhrs()) and call cb(err, body)
  // with the results
});
```