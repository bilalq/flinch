var http = require('http')
  , events = require('../services/event_manager')
  , notify = require('../services/notifier');

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
      event = events.find(body.event);
    } else if (req.method === 'POST') {
      // Announce status of event
      event = events.add(body);
      if (body.statusCode === 0) {
        notify.success(body);
      } else {
        notify.fail(body);
      }
    } else if (req.method === 'DELETE') {
      // Flush events
      events.clear();
      notify.flush();
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
