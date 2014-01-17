var request = require('request')
  , converter = require('./converter');

module.exports = function(e, opts) {
  return request.post(
    {
      url: 'http://localhost:' + this.port
    , json: {
        event: e
      , statusCode: 1
      , ttl: converter.minutesToMilliseconds(opts.ttl)
      }
    }
  , function(err, res, body) {
    opts && opts.callback && opts.callback(err, res, body);
  });
};
