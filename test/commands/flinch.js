var flinchCommander = require('../../lib/flinch');

describe('Flinch commander', function() {
  var flinch;
  before(function(done) {
    flinch = flinch || flinchCommander();
    done();
  });

  it('has an option to specify the port', function(done) {
    expect(_.find(flinch.options, function(opt) {
      return opt.short === '-p' && opt.long === '--port' &&
        opt.optional && !opt.required;
    })).to.exist;
    done();
  });

  describe('command list', function() {
    var findCommand, findOption;
    before(function(done) {
      findCommand = function(cmdName) {
        return _.find(flinch.commands, function(cmd) {
          return cmd._name === cmdName;
        });
      };
      findOption = function(optShortName, optLongName) {
        return _.find(this.options, function(opt) {
          return opt.short === optShortName && opt.long === optLongName;
        });
      };
      done();
    });

    it('includes "server"', function(done) {
      findCommand('server').should.exist;
      done();
    });

    it('includes "s"', function(done) {
      findCommand('s').should.exist;
      done();
    });

    it('includes "flush"', function(done) {
      findCommand('flush').should.exist;
      done();
    });

    it('includes "f"', function(done) {
      findCommand('f').should.exist;
      done();
    });

    it('includes "at"', function(done) {
      var atCmd = findCommand('at');
      atCmd.should.exist;
      findOption.call(atCmd, '-t', '--ttl').should.exist;
      done();
    });

    it('includes "gg"', function(done) {
      var ggCmd = findCommand('gg');
      ggCmd.should.exist;
      findOption.call(ggCmd, '-t', '--ttl').should.exist;
      done();
    });

    it('includes "on"', function(done) {
      findCommand('on').should.exist;
      done();
    });
  });

});
