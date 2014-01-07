var flinchCommander = require('../../lib/flinch');

describe('Flinch commander', function() {
  var flinch;
  before(function(done) {
    flinch = flinch || flinchCommander();
    done();
  });

  it('should have an option to specify the port', function(done) {
    expect(_.find(flinch.options, function(opt) {
      return opt.short === '-p' && opt.long === '--port' &&
        opt.optional && !opt.required;
    })).to.not.be.undefined;
    done();
  });


  describe('commands', function() {
    var hasCommand;
    before(function(done) {
      hasCommand = function(cmdName) {
        return !!_.find(flinch.commands, function(cmd) {
          return cmd._name === cmdName;
        });
      };
      done();
    });

    it('should have "server"', function(done) {
      hasCommand('server').should.be.true;
      done();
    });

    it('should have "s"', function(done) {
      hasCommand('s').should.be.true;
      done();
    });

    it('should have "at"', function(done) {
      hasCommand('at').should.be.true;
      done();
    });

    it('should have "on"', function(done) {
      hasCommand('on').should.be.true;
      done();
    });

  });
});
