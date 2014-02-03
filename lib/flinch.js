var flinch = require('commander')
  , server = require('./commands/server')
  , on = require('./commands/on')
  , at = require('./commands/at')
  , gg = require('./commands/gg')
  , flush = require('./commands/flush')
  , pjson = require('../package.json');

module.exports = function() {
  flinch
    .version(pjson.version)
    .option('-p, --port [port]', 'specify which port to use [Default: 3030]', parseInt, 3030);

  flinch
    .command('server')
    .description('start a flinch server')
    .option('-g, --growl', 'enable growl notifications')
    .action(server.start);

  flinch
    .command('s')
    .description('alias for server command')
    .option('-g, --growl', 'enable growl notifications')
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

  flinch
    .command('flush')
    .description('clear list of announced events')
    .action(flush);

  flinch
    .command('f')
    .description('alias for flush command')
    .action(flush);

  return flinch;
};
