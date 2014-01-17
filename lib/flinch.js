var flinch = require('commander')
  , server = require('./server')
  , on = require('./on')
  , at = require('./at')
  , gg = require('./gg')
  , pjson = require('../package.json');

var minutesToMilliseconds = function(minutes) {
  return parseInt(minutes, 10) * 60 * 1000;
};

module.exports = function() {
  flinch
    .version(pjson.version)
    .option('-p, --port [port]', 'specify which port to use [Default: 3030]', parseInt, 3030);

  flinch
    .command('server')
    .description('start a flinch server')
    .action(server.start);

  flinch
    .command('s')
    .description('alias for server command')
    .action(server.start);

  flinch
    .command('on <event>')
    .description('block on the specified event')
    .action(on);

  flinch
    .command('at <event>')
    .description('announce that the specified event has occurred')
    .option('-t, --ttl [ttl]', 'set time to live for event success announcement in minutes', parseInt, 10)
    .action(at);

  flinch
    .command('gg <event>')
    .description('announce that the specified event has failed')
    .option('-t, --ttl [ttl]', 'set time to live for event failure announcement in minutes', parseInt, 10)
    .action(gg);

  return flinch;
};
