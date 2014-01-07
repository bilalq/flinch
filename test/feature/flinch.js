var onCmd = require('../../lib/on')
  , atCmd = require('../../lib/at')
  , serverCmd = require('../../lib/server');

describe('Feature spec', function() {
  var port
    , event
    , context
    , flinchServer;

  beforeEach(function(done) {
    port = 5030;
    event = 'event';
    context = { port: port };
    mute();
    flinchServer = serverCmd.start.call(context);
    unmute();
    done();
  });

  afterEach(function(done) {
    flinchServer.close(done);
  });

  describe('flinch server', function() {
    it('should start up a server', function(done) {
      flinchServer.address().port.should.equal(port);
      done();
    });
  });

  describe('flinch at', function() {
    it('should make a POST request to the server', function(done) {
      atCmd.call(context, event, {callback: function(err, res, body) {
        res.statusCode.should.equal(200);
        body.flinched.should.be.true;
        done();
      }});
    });
  });

  describe('flinch on', function() {
    it('should block until flinched at', function(done) {
      this.timeout(5000);
      var onEvent
        , atEvent;

      onEvent = onCmd.call(context, event);
      onEvent.blocking.should.be.true;
      setTimeout(function() {
        var processMock = sinon.mock(process);
        processMock.expects('exit').atLeast(1);
        onEvent.blocking.should.be.true;
        atEvent = atCmd.call(context, event);
        setTimeout(function() {
          onEvent.blocking.should.be.false;
          processMock.verify();
          done();
        }, 1500);
      }, 50);
    });
  });
});
