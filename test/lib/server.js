var http = require('http')
  , server = require('../../lib/server');

describe('Server', function() {
  var spy;

  before(function(done) {
    spy = sinon.spy();
    sinon.stub(http, 'createServer').returns({listen: spy});
    done();
  });

  after(function(done) {
    http.createServer.restore();
    done();
  });

  it('listens on the port value of the caller', function(done) {
    mute();
    server.call({port: 5000});
    spy.should.have.been.calledWith(5000);
    server.call({port: 3030});
    spy.should.have.been.calledWith(3030);
    unmute();
    done();
  });

});
