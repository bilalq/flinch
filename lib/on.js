var request = require('request');

module.exports = function(e, opts) {
  var self = this
    , state = { blocking: true }
    , interval
    , onHandler;

  opts = opts || {};

  onHandler = function() {
    var requestObj
      , callback;

    requestObj = {
      url: 'http://localhost:' + self.port
    , json: {
        event: e
      }
    };

    callback = (opts && opts.callback) || function(err, res, body) {
      if (body && body.flinched) {
        state.blocking = false;
        clearInterval(interval);
        process.exit(body.status_code);
      }
    };

    request.get(requestObj, callback);
  };

  interval = setInterval(onHandler, (opts.intervalTime || 1000));
  return state;
};
