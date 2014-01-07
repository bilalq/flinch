var http = require('http')
  , server = require('../../lib/server');

describe('Server', function() {
  var spy;

  beforeEach(function(done) {
    spy = sinon.spy();
    sinon.stub(http, 'createServer').returns({listen: spy});
    done();
  });

  afterEach(function(done) {
    http.createServer.restore();
    done();
  });

  it('listens on the port value of the caller', function(done) {
    mute();
    server.start.call({port: 5000});
    spy.should.have.been.calledWith(5000);
    unmute();
    done();
  });

});
