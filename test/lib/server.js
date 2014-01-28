var http = require('http')
  , server = require('../../lib/server')
  , events = require('../../lib/events')
  , clc = require('../../lib/color_logger');

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
      var eventsMock, clcMock;

      beforeEach(function(done) {
        reqStub.method = 'POST';
        eventsMock = sinon.mock(events);
        clcMock = sinon.mock(clc);
        done();
      });

      afterEach(function(done) {
        eventsMock.verify();
        clcMock.verify();
        done();
      });

      it('adds event to internal list and prints success message on flinch at', function(done) {
        body.statusCode = 0;
        stub_request_body();
        eventsMock.expects('add').withArgs(body).once();
        clcMock.expects('success').once();

        server.requestHandler(reqStub, resSpy);

        resSpy.writeHead.should.have.been.calledWith(200, headers);
        resSpy.end.should.have.been.called;
        done();
      });

      it('adds event to internal list and prints fail message on flinch gg', function(done) {
        body.statusCode = 1;
        stub_request_body();
        eventsMock.expects('add').withArgs(body).once();
        clcMock.expects('fail').once();

        server.requestHandler(reqStub, resSpy);

        resSpy.writeHead.should.have.been.calledWith(200, headers);
        resSpy.end.should.have.been.called;
        done();
      });
    });

    it('clears events on a DELETE request', function(done) {
      var eventsMock = sinon.mock(events);
      eventsMock.expects('clear').once();

      reqStub.method = 'DELETE';
      stub_request_body();
      mute();
      server.requestHandler(reqStub, resSpy);
      unmute();

      resSpy.writeHead.should.have.been.calledWith(204);
      resSpy.end.should.have.been.called;
      eventsMock.verify();
      done();
    });
  });

  describe('start', function() {
    it('listens on the port value of the caller', function(done) {
      mute();
      server.start.call({port: 5000});
      listenSpy.should.have.been.calledWith(5000);
      unmute();
      done();
    });
  });

});
