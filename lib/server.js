var http = require('http');

module.exports = function(opts) {
  http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Request acknowledged');
    res.end();
  }).listen(this.port);

  console.log("Listening on port " + this.port);
};
