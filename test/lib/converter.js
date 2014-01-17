var converter = require('../../lib/converter');

describe('Converter', function() {

  describe('minutesToMilliseconds function', function() {
    it('converts minutes to milliseconds', function(done) {
      converter.minutesToMilliseconds(2).should.equal(120000);
      done();
    });

    it('converts negative numbers to positive', function(done) {
      converter.minutesToMilliseconds(-1).should.equal(60000);
      done();
    });

    it('returns 0 when given 0', function(done) {
      converter.minutesToMilliseconds(0).should.equal(0);
      done();
    });

    it('works with string arguments', function(done) {
      converter.minutesToMilliseconds('5').should.equal(300000);
      done();
    });
  });

});
