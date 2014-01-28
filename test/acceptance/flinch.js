var onCmd = require('../../lib/on')
  , atCmd = require('../../lib/at')
  , ggCmd = require('../../lib/gg')
  , flushCmd = require('../../lib/flush')
  , serverCmd = require('../../lib/server')
  , events = require('../../lib/events');

describe('Acceptance spec', function() {
  var port, event, ttlOption, context, flinchServer;

  beforeEach(function(done) {
    port = 5030;
    ttlOption = { ttl: 10 };
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
    it('starts up a server', function(done) {
      flinchServer.address().port.should.equal(port);
      done();
    });
  });

  describe('flinch flush', function() {
    it('should clear event list record', function(done) {
      this.timeout(4000);
      var onEvent, atEvent, processMock;
      mute();

      processMock = sinon.mock(process);
      processMock.expects('exit').atLeast(1).withArgs(0);

      atEvent = atCmd.call(context, event, { ttl: 10, callback: function() {
        flushCmd.call(context, { callback: function() {
          onEvent = onCmd.call(context, event, ttlOption);
          setTimeout(function() {
            onEvent.blocking.should.be.true;
            atCmd.call(context, event, ttlOption);
            setTimeout(function() {
              onEvent.blocking.should.be.false;
              processMock.verify();
              unmute();
              done();
            }, 1300);
          }, 1300);
        }});
      }});
    });
  });

  describe('flinch at', function() {
    it('makes a POST request to the server and gets a status code of 0', function(done) {
      mute();
      atCmd.call(context, event, {
        ttl: 10
      , callback: function(err, res, body) {
          res.statusCode.should.equal(200);
          body.flinched.should.be.true;
          body.statusCode.should.equal(0);
          body.event.should.equal(event);
          unmute();
          done();
        }
      });
    });
  });

  describe('flinch gg', function() {
    it('makes a POST request to the server and gets a status code of 1', function(done) {
      mute();
      ggCmd.call(context, event, {callback: function(err, res, body) {
        res.statusCode.should.equal(200);
        body.flinched.should.be.true;
        body.statusCode.should.equal(1);
        body.event.should.equal(event);
        unmute();
        done();
      }});
    });
  });

  describe('flinch on', function() {

    describe('when flinch at is invoked', function() {
      it('blocks until flinched and exits with status code 0', function(done) {
        var onEvent, atEvent;
        this.timeout(2000);

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
          }, 1300);
        }, 50);
      });

      it('should stop blocking if flinched at earlier within a TTL', function(done) {
        var onEvent, atEvent, processMock;
        this.timeout(2000);

        mute();

        atEvent = atCmd.call(context, event, ttlOption);
        setTimeout(function() {
          processMock = sinon.mock(process);
          processMock.expects('exit').atLeast(1).withArgs(0);
          onEvent = onCmd.call(context, event, ttlOption);
          setTimeout(function() {
            onEvent.blocking.should.not.be.true;
            processMock.verify();
            unmute();
            done();
          }, 1300);
        }, 50);
      });
    });

    describe('when flinch gg is invoked', function() {
      it('blocks until flinched and exits with status code 1', function(done) {
        this.timeout(3000);
        var event = 'gg', onEvent, ggEvent, processMock;

        mute();
        onEvent = onCmd.call(context, event);
        onEvent.blocking.should.be.true;
        setTimeout(function() {
          processMock = sinon.mock(process);
          processMock.expects('exit').atLeast(1).withArgs(1);
          onEvent.blocking.should.be.true;
          ggEvent = ggCmd.call(context, event, ttlOption);
          setTimeout(function() {
            onEvent.blocking.should.be.false;
            processMock.verify();
            unmute();
            done();
          }, 1300);
        }, 50);
      });
    });

  });

  describe('when multiple announcements are made on the same event', function() {
    var onEvent, processMock;

    beforeEach(function(done) {
      processMock = sinon.mock(process);
      done();
    });

    afterEach(function(done) {
      processMock.verify();
      done();
    });

    it('keeps only the latest announcement when at is called last', function(done) {
      processMock.expects('exit').withArgs(0).atLeast(1);
      processMock.expects('exit').withArgs(1).never();

      mute();
      ggCmd.call(context, event, { ttl: 10, callback: function() {
        atCmd.call(context, event, { ttl: 10, callback: function() {
          onEvent = onCmd.call(context, event);
          setTimeout(function() {
            unmute();
            done();
          }, 1100);
        }});
      }});
    });

    it('keeps only the latest announcement when gg is called last', function(done) {
      processMock.expects('exit').withArgs(1).atLeast(1);
      processMock.expects('exit').withArgs(0).never();

      mute();
      atCmd.call(context, event, { ttl: 10, callback: function() {
        ggCmd.call(context, event, { ttl: 10, callback: function() {
          onEvent = onCmd.call(context, event);
          setTimeout(function() {
            unmute();
            done();
          }, 1100);
        }});
      }});
    });
  });

});
