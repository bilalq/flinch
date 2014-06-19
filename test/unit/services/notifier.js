var notify = require('../../../lib/services/notifier')
var clc = require('cli-color')

describe('Notifier', function() {
  var consoleStub, msg, growlStub

  beforeEach(function(done) {
    growlStub = sinon.stub(notify, 'growl')
    done()
  })

  afterEach(function(done) {
    growlStub.restore()
    done()
  })

  describe('event', function() {
    it('logs a green message on flinch at', function(done) {
      consoleStub = sinon.stub(console, 'log')
      notify.event({ ttl: 5, statusCode: 0, event: 'e'})
      consoleStub.should.have.been.calledWithMatch(sinon.match(styleMatch.green))
      consoleStub.restore()
      done()
    })

    it('logs a red message on flinch at', function(done) {
      consoleStub = sinon.stub(console, 'log')
      notify.event({ ttl: 5, statusCode: 1, event: 'e'})
      consoleStub.should.have.been.calledWithMatch(sinon.match(styleMatch.red))
      consoleStub.restore()
      done()
    })
  })

  describe('flush', function() {
    it('logs a bold message on flinch flush', function(done) {
      consoleStub = sinon.stub(console, 'log')
      notify.flush()
      consoleStub.should.have.been.calledWithMatch(sinon.match(styleMatch.bold))
      consoleStub.restore()
      done()
    })
  })

  describe('growl support', function() {
    it('is disabled by default', function(done) {
      mute()
      notify.flush()
      growlStub.should.not.have.been.called
      unmute()
      done()
    })

    it('can be enabled via set_growl_support', function(done) {
      mute()
      notify.set_growl_support(true)
      notify.flush()
      growlStub.should.have.been.called
      unmute()
      done()
    })
  })

})
