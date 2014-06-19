var request = require('request')

module.exports = function(opts) {
  var reqBody = { url: 'http://localhost:' + this.port }

  return request.del(reqBody, function(err, res, body) {
    opts && opts.callback && opts.callback(err, res, body)
  })
}
