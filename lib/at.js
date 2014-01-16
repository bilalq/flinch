var request = require('request');

module.exports = function(e, opts) {
  return request.post(
    {
      url: 'http://localhost:' + this.port
    , json: {
        event: e
      , statusCode: 0
      , ttl: opts.ttl
      }
    }
  , function(err, res, body) {
    opts && opts.callback && opts.callback(err, res, body);
  });
};
