var http = require('http')
  , _ = require('underscore')
  , clc = require('./color_logger');

var eventList = [];

exports.findEvent = function(body) {
  var event = _.findWhere(eventList, { event: body.event });
  event = event || { flinched: false, event: body.event };
  return event;
};

exports.addEvent = function(body) {
  body.flinched = true;
  eventList = exports.rejectEvent(body.event);
  eventList.push(body);
  exports.expireEvent(body);
  return body;
};

exports.rejectEvent = function(event) {
  return _.reject(eventList, function(e) {
    return e.event === event;
  });
};

exports.expireEvent = function(body) {
  if (body.ttl !== 0) {
    setTimeout(function() {
      eventList = exports.rejectEvent(body.event);
    }, body.ttl);
  }
};

exports.clearEvents = function() {
  eventList.length = 0;
};

exports.getEvents = function() {
  return eventList;
};

exports.requestHandler = function(req, res) {
  var body = '';
  req.on('data', function(chunk) {
    body += chunk.toString();
  });
  req.on('end', function() {
    var event;
    body = body ? JSON.parse(body) : {};
    if (req.method === 'GET') {
      // Block on event
      event = exports.findEvent(body);
    } else if (req.method === 'POST') {
      // Announce status of event
      event = exports.addEvent(body);
      if (body.statusCode === 0) {
        clc.success(body);
      } else {
        clc.fail(body);
      }
    } else if (req.method === 'DELETE') {
      // Flush events
      exports.clearEvents();
      clc.flush();
      res.writeHead(204);
      return res.end();
    }
    res.writeHead(200, {'Content-Type': 'text/json'});
    res.end(JSON.stringify(event));
  });
};

exports.start = function(opts) {
  var server = http.createServer(exports.requestHandler);
  server.listen(this.port);
  console.log("Listening on port " + this.port);

  return server;
};
