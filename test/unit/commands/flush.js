var request = require('request')
  , flushCmd = require('../../../lib/commands/flush')

describe('Flush', function() {
  it('sends delete request to server', function(done) {
    var requestMock = sinon.mock(request)
      , port = 3030

    requestMock.expects('del').once()

    flushCmd.call({ port: port })
    requestMock.verify()
    done()
  })
})
