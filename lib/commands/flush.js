var request = require('request');

module.exports = function(opts) {
  return request.del(
    { url: 'http://localhost:' + this.port }
  , function(err, res, body) {
    opts && opts.callback && opts.callback(err, res, body);
  });
};
