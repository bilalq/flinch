var http = require('http')
  , server = require('../../../lib/commands/server')
  , events = require('../../../lib/services/event_manager')
  , notify = require('../../../lib/services/notifier');

describe('Server', function() {
  var listenSpy;

  beforeEach(function(done) {
    listenSpy = sinon.spy();
    sinon.stub(http, 'createServer').returns({listen: listenSpy});
    done();
  });

  afterEach(function(done) {
    http.createServer.restore();
    done();
  });

  describe('requestHandler', function() {
    var reqStub, resSpy, headers, body, stub_request_body;

    beforeEach(function(done) {
      headers = { 'Content-Type': 'text/json' };
      body = { event: 'e' };
      reqStub = { on: sinon.stub() };
      resSpy = { writeHead: sinon.spy() , end: sinon.spy() };

      stub_request_body = function() {
        reqStub.on.withArgs('data').yields(JSON.stringify(body));
      };

      reqStub.on.withArgs('end').yields();
      done();
    });

    it('responds with the event and flinched status on GET', function(done) {
      stub_request_body();
      reqStub.method = 'GET';
      server.requestHandler(reqStub, resSpy);
      resSpy.writeHead.should.have.been.calledWith(200, headers);
      resSpy.end.should.have.been.calledWithMatch(JSON.stringify({flinched: false, event: 'e'}));
      done();
    });

    describe('POST request for announcing flinch event', function() {
      var eventsMock, notifyMock;

      beforeEach(function(done) {
        reqStub.method = 'POST';
        eventsMock = sinon.mock(events);
        notifyMock = sinon.mock(notify);
        done();
      });

      afterEach(function(done) {
        eventsMock.verify();
        notifyMock.verify();
        done();
      });

      it('adds event to internal list and notifies on flinch at', function(done) {
        body.statusCode = 0;
        stub_request_body();
        eventsMock.expects('add').withArgs(body).once();
        notifyMock.expects('event').withArgs(body).once();

        mute();
        server.requestHandler(reqStub, resSpy);
        unmute();

        resSpy.writeHead.should.have.been.calledWith(200, headers);
        resSpy.end.should.have.been.called;
        done();
      });

      it('adds event to internal list and notifies on flinch gg', function(done) {
        body.statusCode = 1;
        stub_request_body();
        eventsMock.expects('add').withArgs(body).once();
        notifyMock.expects('event').withArgs(body).once();

        mute();
        server.requestHandler(reqStub, resSpy);
        unmute();

        resSpy.writeHead.should.have.been.calledWith(200, headers);
        resSpy.end.should.have.been.called;
        done();
      });
    });

    it('clears events on a DELETE request', function(done) {
      var eventsMock = sinon.mock(events);
      var notifyMock = sinon.mock(notify);
      eventsMock.expects('clear').once();
      notifyMock.expects('flush').once();

      reqStub.method = 'DELETE';
      stub_request_body();
      mute();
      server.requestHandler(reqStub, resSpy);
      unmute();

      resSpy.writeHead.should.have.been.calledWith(204);
      resSpy.end.should.have.been.called;
      eventsMock.verify();
      notifyMock.verify();
      done();
    });

    it('responds with 400 on a PUT request', function(done) {
      reqStub.method = 'PUT';
      stub_request_body();
      mute();
      server.requestHandler(reqStub, resSpy);
      unmute();

      resSpy.writeHead.should.have.been.calledWith(400);
      resSpy.end.should.have.been.called;
      done();
    });
  });

  describe('start', function() {
    it('listens on the port value of the caller', function(done) {
      mute();
      server.start.call({ port: 5000 });
      listenSpy.should.have.been.calledWith(5000);
      unmute();
      done();
    });

    it('enables growl notifications if options say to', function(done) {
      var notifyMock = sinon.mock(notify);
      notifyMock.expects('set_growl_support').withArgs(true).once();
      server.start.call({ port: 5000 }, { growl: true });
      notifyMock.verify();
      done();
    });
  });

});
