var clc = require('../../lib/color_logger');

describe('Color Logger', function() {

  describe('success function', function() {
    it('writes to the console in green text', function(done) {
      var consoleMock, msg;

      consoleMock = sinon.mock(console);
      consoleMock.expects('log').once();
      msg = clc.success('test');

      consoleMock.verify();
      msg.startsWith("\u001b[32m").should.be.true;
      msg.endsWith("\u001b[39m").should.be.true;
      done();
    });
  });

  describe('fail function', function() {
    it('writes to the console in red text', function(done) {
      var consoleMock, msg;

      consoleMock = sinon.mock(console);
      consoleMock.expects('log').once();
      msg = clc.fail('test');
      consoleMock.verify();
      msg.startsWith("\u001b[31m").should.be.true;
      msg.endsWith("\u001b[39m").should.be.true;
      done();
    });
  });
});
