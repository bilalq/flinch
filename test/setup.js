// Test helpers
global.sinon = require('sinon')
global.chai = require('chai')
global.should = require('chai').should()
global.expect = require('chai').expect
global.AssertionError = require('chai').AssertionError
global.sinonChai = require('sinon-chai')
global._ = require('underscore')
chai.use(sinonChai)

// Styled string matchers
global.styleMatch = {
  startsAndEndsWith: function(str, start, end) {
   return str.startsWith(start) && str.endsWith(end)
  },
  green: function(str) {
     return styleMatch.startsAndEndsWith(str, '\u001b[32', '\u001b[39m')
  },
  red: function(str) {
     return styleMatch.startsAndEndsWith(str, '\u001b[31', '\u001b[39m')
  },
  bold: function(str) {
     return styleMatch.startsAndEndsWith(str, '\u001b[1', '\u001b[22m')
  }
}

// Easy muting/unmuting of console.log
var muted = false
  , console_logger = console.log
global.mute = function() {
  if (!muted) {
    console.log = function() {}
    muted = true
  }
}
global.unmute = function() {
  if (muted) {
    muted = false
    console.log = console_logger
  }
}

// Helper function to run shell commands
global.run_cmd = function(cmd, args, callback) {
  var spawn = require('child_process').spawn
    , child = spawn(cmd, args)
    , res = ''

  child.stdout.on('data', function(buffer) { res += buffer.toString() })
  child.stdout.on('end', function() { callback(res) })
  return child
}

// Polyfills
if (!String.prototype.startsWith) {
  Object.defineProperty(String.prototype, 'startsWith', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function (searchString, position) {
      position = position || 0
      return this.indexOf(searchString, position) === position
    }
  })
}
if (!String.prototype.endsWith) {
  Object.defineProperty(String.prototype, 'endsWith', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function (searchString, position) {
      position = position || this.length
      position = position - searchString.length
      var lastIndex = this.lastIndexOf(searchString)
      return lastIndex !== -1 && lastIndex === position
    }
  })
}
