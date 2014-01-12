var request = require('request')
  , atCmd = require('../../lib/at');

describe('At', function() {
  it('should post to server', function(done) {
    var requestMock = sinon.mock(request)
      , event = 'someEvent'
      , port = 3030;

    requestMock.expects('post').once().withArgs(
      {
        url: 'http://localhost:' + port
      , json: {
          event: event
        , status_code: 0
        }
      }
    );

    atCmd.call({ port: port }, event);
    requestMock.verify();
    done();
  });
});
