var clc = require('cli-color')
  , humanizer = require('./humanizer');

var compose = function(color) {
  var cmd = this.statusCode === 0 ? 'at' : 'gg'
    , msg = [humanizer.date(), 'flinch', cmd, this.event].join(' ');
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
