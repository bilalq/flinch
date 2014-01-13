var onCmd = require('../../lib/on')
  , atCmd = require('../../lib/at')
  , ggCmd = require('../../lib/gg')
  , serverCmd = require('../../lib/server');

describe('Acceptance spec', function() {
  var port
    , event
    , ttlOption
    , context
    , flinchServer;

  beforeEach(function(done) {
    port = 5030;
    ttlOption = { ttl: 15000 };
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
    it('should make a POST request to the server and get a status code of 0', function(done) {
      mute();
      atCmd.call(context, event, {
        ttl: 15000
      , callback: function(err, res, body) {
          res.statusCode.should.equal(200);
          body.flinched.should.be.true;
          body.status_code.should.equal(0);
          body.event.should.equal(event);
          unmute();
          done();
        }
      });
    });
  });

  describe('flinch gg', function() {
    it('should make a POST request to the server and get a status code of 1', function(done) {
      mute();
      ggCmd.call(context, event, {callback: function(err, res, body) {
        res.statusCode.should.equal(200);
        body.flinched.should.be.true;
        body.status_code.should.equal(1);
        body.event.should.equal(event);
        unmute();
        done();
      }});
    });
  });

  describe('flinch on', function() {

    describe('when flinch at is invoked', function() {
      it('should block until flinched and exit with status code 0', function(done) {
        this.timeout(5000);
        var onEvent
          , atEvent;

        mute();
        onEvent = onCmd.call(context, event, ttlOption);
        onEvent.blocking.should.be.true;
        setTimeout(function() {
          var processMock = sinon.mock(process);
          processMock.expects('exit').atLeast(1).withArgs(0);
          onEvent.blocking.should.be.true;
          atEvent = atCmd.call(context, event, ttlOption);
          setTimeout(function() {
            onEvent.blocking.should.be.false;
            processMock.verify();
            unmute();
            done();
          }, 1400);
        }, 50);
      });
    });

    describe('when flinch gg is invoked', function() {
      it('should block until flinched and exit with status code 1', function(done) {
        this.timeout(5000);
        var event = 'gg'
          , onEvent
          , ggEvent;

        mute();
        onEvent = onCmd.call(context, event);
        onEvent.blocking.should.be.true;
        setTimeout(function() {
          var processMock = sinon.mock(process);
          processMock.expects('exit').atLeast(1).withArgs(1);
          onEvent.blocking.should.be.true;
          ggEvent = ggCmd.call(context, event, ttlOption);
          setTimeout(function() {
            onEvent.blocking.should.be.false;
            processMock.verify();
            unmute();
            done();
          }, 1400);
        }, 50);
      });
    });

  });

});
