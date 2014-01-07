var flinch = require('commander')
  , server = require('./server')
  , on = require('./on')
  , at = require('./at')
  , pjson = require('../package.json');

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
    .action(at);

  return flinch;
};
