var request = require('request')
  , ggCmd = require('../../lib/gg');

describe('GG', function() {
  it('should post to server', function(done) {
    var requestMock = sinon.mock(request)
      , event = 'someEvent'
      , port = 3030;

    requestMock.expects('post').once().withArgs(
      {
        url: 'http://localhost:' + port
      , json: {
          event: event
        , status_code: 1
        , ttl: 15000
        }
      }
    );

    ggCmd.call({ port: port }, event, { ttl: 15000 });
    requestMock.verify();
    done();
  });
});
