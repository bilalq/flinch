var request = require('request');

module.exports = function(e, opts) {
  var self = this
    , interval
    , onHandler;

  self.blocking = true;

  onHandler = function() {
    request.get({
        url: 'http://localhost:' + self.port
      , json: {
        event: e
      }
    }
    , function(err, res, body) {
      if (body && body.flinched) {
        self.blocking = false;
        clearInterval(interval);
        process.exit(0);
      }
    });
  };

  interval = setInterval(onHandler, 1000);
  return this;
};
