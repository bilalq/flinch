var request = require('request')
  , ggCmd = require('../../../lib/commands/gg')

describe('GG', function() {
  it('makes POST request to the server', function(done) {
    var requestMock = sinon.mock(request)
      , event = 'someEvent'
      , port = 3030

    requestMock.expects('post').once().withArgs({
      url: 'http://localhost:' + port,
      json: {
        event: event,
        statusCode: 1,
        ttl: 10 * 60 * 1000
      }
    })

    ggCmd.call({ port: port }, event, { ttl: 10 })
    requestMock.verify()
    done()
  })
})
