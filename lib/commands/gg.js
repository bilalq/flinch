var request = require('request')
  , convert = require('../services/converter');

module.exports = function(e, opts) {
  return request.post(
    {
      url: 'http://localhost:' + this.port
    , json: {
        event: e
      , statusCode: 1
      , ttl: convert.minutesToMilliseconds(opts.ttl)
      }
    }
  , function(err, res, body) {
    opts && opts.callback && opts.callback(err, res, body);
  });
};
