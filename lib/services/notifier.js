var clc = require('cli-color')
  , growl = require('growl')
  , convert = require('./converter')
  , humanize = require('./humanizer')
  , growl_enabled

var notify = function(console_msg, growl_msg) {
  console.log(console_msg)
  if (growl_enabled) {
    exports.growl(growl_msg, { title: 'Flinch' })
  }
  return console_msg
}

exports.event = function(body) {
  var cmd, msg, color
    , ttl = (body.ttl) ? convert.millisecondsToMinutes(body.ttl) : 'Infinite'
    , ttlMessage = '[TTL: ' + ttl + ']'

  if (body.statusCode === 0) {
    cmd = 'at'
    color = 'green'
  } else {
    cmd = 'gg'
    color = 'red'
  }
  msg = clc[color]([humanize.date(), ttlMessage, 'flinch', cmd, body.event].join(' '))

  return notify(msg, cmd + ' ' + body.event)
}

exports.flush = function() {
  var msg = clc.bold(humanize.date() + ' flinch events flushed')
  return notify(msg, 'events flushed')
}

exports.set_growl_support = function(enable) {
  growl_enabled = enable
}

// Export the dependency on growl because there's no other way to stub it
exports.growl = growl
