// Test helpers
global.sinon = require('sinon');
global.chai = require('chai');
global.should = require('chai').should();
global.expect = require('chai').expect;
global.AssertionError = require('chai').AssertionError;
global.sinonChai = require('sinon-chai');
global._ = require('underscore');
chai.use(sinonChai);

// Easy muting/unmuting of console.log
var muted = false;
global.mute = function() {
  if (!muted) {
    sinon.stub(console, 'log');
    muted = true;
  }
};
global.unmute = function() {
  if (console.log.restore) {
    muted = false;
    console.log.restore();
  }
};

// Helper function to run shell commands
global.run_cmd = function(cmd, args, callback) {
  var spawn = require('child_process').spawn
    , child = spawn(cmd, args)
    , res = '';

  child.stdout.on('data', function(buffer) { res += buffer.toString(); });
  child.stdout.on('end', function() { callback(resp); });
  return child;
};

// Polyfills
if (!String.prototype.startsWith) {
  Object.defineProperty(String.prototype, 'startsWith', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function (searchString, position) {
      position = position || 0;
      return this.indexOf(searchString, position) === position;
    }
  });
}
if (!String.prototype.endsWith) {
  Object.defineProperty(String.prototype, 'endsWith', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function (searchString, position) {
      position = position || this.length;
      position = position - searchString.length;
      var lastIndex = this.lastIndexOf(searchString);
      return lastIndex !== -1 && lastIndex === position;
    }
  });
}
