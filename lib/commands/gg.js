var request = require('request')
  , convert = require('../services/converter')

module.exports = function(e, opts) {
  var reqBody = {
    url: 'http://localhost:' + this.port,
    json: {
      event: e,
      statusCode: 1,
      ttl: convert.minutesToMilliseconds(opts.ttl)
    }
  }

  return request.post(reqBody, function(err, res, body) {
    opts && opts.callback && opts.callback(err, res, body)
  })
}
