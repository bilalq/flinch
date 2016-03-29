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
    switch(req.method) {
      case 'GET': // Flinch on
        event = events.find(body.event);
        break;
      case 'POST': // Flinch at OR Flinch gg
        event = events.add(body);
        notify.event(body);
        break;
      case 'DELETE': // Flinch flush
        events.clear();
        notify.flush();
        res.writeHead(204);
        return res.end();
      default: // Bad request
        res.writeHead(400);
        return res.end();
    }
    res.writeHead(200, {'Content-Type': 'text/json'});
    res.end(JSON.stringify(event));
  });
};

exports.start = function(opts) {
  notify.set_growl_support(opts && opts.growl);
  var server = http.createServer(exports.requestHandler);
  server.listen(this.port);
  console.log("Listening on port " + this.port);

  return server;
};
