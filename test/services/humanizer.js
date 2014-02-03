var humanizer = require('../../lib/services/humanizer');

describe('Humanizer', function() {
  describe('date function', function() {
    it('formats to [YYYY-MM-DD HH:MM:SS]', function(done) {
      var fakeDate;

      fakeDate = new Date(Date.parse('2013-02-03 02:04:02'));
      humanizer.date(fakeDate).should.equal('[2013-02-03 02:04:02]');

      fakeDate = new Date(Date.parse('2003-12-31 12:44:02'));
      humanizer.date(fakeDate).should.equal('[2003-12-31 12:44:02]');

      done();
    });
  });
});
