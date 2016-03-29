var request = require('request')
  , atCmd = require('../../../lib/commands/at');

describe('At', function() {
  it('posts to server', function(done) {
    var requestMock = sinon.mock(request)
      , event = 'someEvent'
      , port = 3030;

    requestMock.expects('post').once().withArgs(
      {
        url: 'http://localhost:' + port
      , json: {
          event: event
        , statusCode: 0
        , ttl: 10 * 60 * 1000
        }
      }
    );

    atCmd.call({ port: port }, event, { ttl: 10 });
    requestMock.verify();
    done();
  });
});
