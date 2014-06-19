var request = require('request')

module.exports = function(e, opts) {
  var self = this
    , state = { blocking: true }
    , interval
    , onHandler

  opts = opts || {}

  onHandler = function() {
    var reqBody
      , callback

    reqBody = {
      url: 'http://localhost:' + self.port,
      json: { event: e }
    }

    callback = (opts && opts.callback) || function(err, res, body) {
      if (body && body.flinched) {
        state.blocking = false
        clearInterval(interval)
        process.exit(body.statusCode)
      }
    }

    request.get(reqBody, callback)
  }

  interval = setInterval(onHandler, (opts.intervalTime || 1000))
  return state
}
