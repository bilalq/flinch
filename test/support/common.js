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
var logger = console.log;
global.mute = function() {
  console.log = sinon.stub();
};
global.unmute = function() {
  console.log = logger;
};
