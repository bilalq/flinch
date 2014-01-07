var http = require('http')
  , _ = require('underscore');

var eventList = [];

exports.hasFlinched = function(body) {
  return !!_.findWhere(eventList, { event: body.event });
};

exports.addEvent = function(body) {
  eventList.push(body);
  exports.expireEvent(body);
};

exports.expireEvent = function(body) {
  var ttl = body.ttl || 15000;
  setTimeout(function() {
    eventList = _.reject(eventList, function(e) {
      return e.event === body.event;
    });
  }, ttl);
};

exports.start = function(opts) {
  var server = http.createServer(function(req, res) {
    var body = '';
    req.on('data', function(chunk) {
      body += chunk.toString();
    });
    req.on('end', function() {
      body = JSON.parse(body);
      var flinched;
      if (req.method === 'POST') {
        // Flinch at
        exports.addEvent(body);
        flinched = true;
      } else {
        // Flinch on
        flinched = exports.hasFlinched(body);
      }
      res.writeHead(200, {'Content-Type': 'text/json'});
      res.end(JSON.stringify( { flinched: flinched } ));
    });
  });
  server.listen(this.port);
  console.log("Listening on port " + this.port);

  return server;
};
