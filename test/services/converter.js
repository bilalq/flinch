var convert = require('../../lib/services/converter');

describe('Converter', function() {

  describe('minutesToMilliseconds function', function() {
    it('converts minutes to milliseconds', function(done) {
      convert.minutesToMilliseconds(2).should.equal(120000);
      done();
    });

    it('converts negative numbers to positive', function(done) {
      convert.minutesToMilliseconds(-1).should.equal(60000);
      done();
    });

    it('returns 0 when given 0', function(done) {
      convert.minutesToMilliseconds(0).should.equal(0);
      done();
    });

    it('works with string arguments', function(done) {
      convert.minutesToMilliseconds('5').should.equal(300000);
      done();
    });
  });

});
