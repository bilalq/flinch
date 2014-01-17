var http = require('http')
  , _ = require('underscore')
  , clc = require('./color_logger');

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
  setTimeout(function() {
    eventList = _.reject(eventList, function(e) {
      return e.event === body.event;
    });
  }, body.ttl);
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
        if (body.statusCode === 0) {
          clc.success(body);
        } else {
          clc.fail(body);
        }
      } else {
        // Block on event
        event = exports.findEvent(body);
      }
      res.writeHead(200, {'Content-Type': 'text/json'});
      res.end(JSON.stringify(event));
    });
  });
  server.listen(this.port);
  console.log("Listening on port " + this.port);

  return server;
};
