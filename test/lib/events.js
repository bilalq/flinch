var events = require('../../lib/events');

describe('Events', function() {

  beforeEach(function(done) {
    events.clear();
    done();
  });

  describe('find', function() {
    it('returns a matching event from the event list', function(done) {
      var event = { event: 'test', flinched: true };
      events.all().push(event);
      events.find('test').should.eql(event);
      done();
    });

    it('returns an object when the event is not in the list', function(done) {
       var event = events.find('missing');
       event.flinched.should.be.false;
       event.event.should.equal('missing');
       done();
    });
  });

  describe('all', function() {
    it('has an empty event list in the beginning', function(done) {
      events.all().should.be.empty;
      done();
    });
  });

  describe('add', function() {
    var removeSpy, expireSpy;

    beforeEach(function(done) {
      removeSpy = sinon.spy(events, 'remove');
      expireSpy = sinon.spy(events, 'expire');
      done();
    });

    afterEach(function(done) {
      events.remove.restore();
      events.expire.restore();
      done();
    });

    it('adds event to the event list', function(done) {
      events.add({event: 'ok'});
      events.all().length.should.equal(1);
      events.all()[0].flinched.should.be.true;
      events.all()[0].event.should.equal('ok');

      removeSpy.should.have.been.calledOnce;
      expireSpy.should.have.been.calledOnce;
      done();
    });

  });

  describe('clear', function() {
    it('empties the event list', function(done) {
      events.all().push({event: 'a', flinched: false});
      events.all().push({event: 'b', flinched: true});
      events.clear();
      events.all().should.be.empty;
      done();
    });
  });

  describe('remove', function() {
    beforeEach(function(done) {
      var eventList = events.all();
      eventList.push({event: 'a', flinched: false});
      eventList.push({event: 'b', flinched: true});
      eventList.push({event: 'c', flinched: true});
      done();
    });

    it('removes only the event being searched for', function(done) {
      events.all().length.should.equal(3);
      events.remove('b');
      events.all().length.should.equal(2);
      events.all()[0].event.should.not.equal('b');
      events.all()[1].event.should.not.equal('b');
      done();
    });

    it('makes no change if the event is not in the list', function(done) {
      events.all().length.should.equal(3);
      events.remove('other');
      events.all().length.should.equal(3);
      events.all()[0].event.should.equal('a');
      events.all()[1].event.should.equal('b');
      events.all()[2].event.should.equal('c');
      done();
    });
  });

  describe('expire', function() {
    var clock, removeSpy;

    beforeEach(function(done) {
      clock = sinon.useFakeTimers();
      removeSpy = sinon.spy(events, 'remove');
      done();
    });

    afterEach(function(done) {
      events.remove.restore();
      clock.restore();
      done();
    });

    it('calls rejectEvent after the ttl expires', function(done) {
      events.expire({event: 'event', ttl: 40000});
      clock.tick(20000);
      removeSpy.should.not.have.been.called;
      clock.tick(30000);
      removeSpy.should.have.been.calledWith('event');
      done();
    });

    it('never calls rejectEvent when the ttl is 0', function(done) {
      events.expire({event: 'event', ttl: 0});
      removeSpy.should.not.have.been.called;
      clock.tick(900000);
      removeSpy.should.not.have.been.called;
      done();
    });
  });
});
