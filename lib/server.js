var http = require('http')
  , _ = require('underscore');

var eventList = [];

exports.findEvent = function(body) {
  var event = _.findWhere(eventList, { event: body.event });
  event = event || { flinched: false };
  return event;
};

exports.addEvent = function(body) {
  body.flinched = true;
  eventList.push(body);
  exports.expireEvent(body);
  return body;
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
      var event;
      body = JSON.parse(body);
      if (req.method === 'POST') {
        // Announce status of event
        event = exports.addEvent(body);
      } else {
        // Block on event
        event = exports.findEvent(body);
      }
      console.log(event);
      res.writeHead(200, {'Content-Type': 'text/json'});
      res.end(JSON.stringify(event));
    });
  });
  server.listen(this.port);
  console.log("Listening on port " + this.port);

  return server;
};
