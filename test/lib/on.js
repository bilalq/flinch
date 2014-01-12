var request = require('request')
  , onCmd = require('../../lib/on');

describe('On', function() {
  it('should block until flinched', function(done) {
    var processMock = sinon.mock(process)
      , flinchState = { flinched: false }
      , blockState;

    processMock.expects('exit').atLeast(1).withArgs(0);
    sinon.stub(request, 'get', function(data, callback) {
      callback(null, null, flinchState);
    });

    blockState = onCmd('someEvent', { intervalTime: 60 });
    blockState.blocking.should.be.true;

    flinchState.flinched = true;
    flinchState.status_code = 0;
    setTimeout(function() {
      blockState.blocking.should.be.false;
      processMock.verify();
      request.get.restore();
      done();
    }, 120);
  });
});
