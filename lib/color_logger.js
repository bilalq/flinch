var clc = require('cli-color')
  , converter = require('./converter')
  , humanizer = require('./humanizer');

var compose = function(color) {
  var cmd = (this.statusCode === 0) ? 'at' : 'gg'
    , ttl = (this.ttl) ? converter.millisecondsToMinutes(this.ttl) : 'Infinite'
    , ttlMessage = '[TTL: ' + ttl + ']'
    , msg = [humanizer.date(), ttlMessage, 'flinch', cmd, this.event].join(' ');
  return clc[color](msg);
};

exports.success = function(body) {
  var successMsg = compose.call(body, 'green');
  console.log(successMsg);
  return successMsg;
};

exports.fail = function(body) {
  var failureMsg = compose.call(body, 'red');
  console.log(failureMsg);
  return failureMsg;
};

exports.flush = function() {
    var msg = clc.bold([humanizer.date(), 'flinch events flushed'].join(' '));
    console.log(msg);
    return msg;
};
