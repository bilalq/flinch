var clc = require('cli-color')
  , growl = require('growl')
  , convert = require('./converter')
  , humanize = require('./humanizer');

var announce_event = function(color) {
  var cmd = (this.statusCode === 0) ? 'at' : 'gg'
    , ttl = (this.ttl) ? convert.millisecondsToMinutes(this.ttl) : 'Infinite'
    , ttlMessage = '[TTL: ' + ttl + ']'
    , msg = [humanize.date(), ttlMessage, 'flinch', cmd, this.event].join(' ');
  msg = clc[color](msg);
  console.log(msg);
  return msg;
};

exports.success = function(body) {
  return announce_event.call(body, 'green');
};

exports.fail = function(body) {
  return announce_event.call(body, 'red');
};

exports.flush = function() {
    var msg = clc.bold(humanize.date() + ' flinch events flushed');
    console.log(msg);
    return msg;
};
