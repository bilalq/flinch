var _ = require('underscore')

var eventList = []

exports.find = function(e) {
  var event = _.findWhere(eventList, { event: e })
  event = event || { flinched: false, event: e }
  return event
}

exports.all = function() {
  return eventList
}

exports.add = function(body) {
  body.flinched = true
  exports.remove(body.event)
  eventList.push(body)
  exports.expire(body)
  return body
}

exports.remove = function(event) {
  eventList = _.reject(eventList, function(e) {
    return e.event === event
  })
  return eventList
}

exports.expire = function(body) {
  if (body.ttl !== 0) {
    setTimeout(function() {
      exports.remove(body.event)
    }, body.ttl)
  }
}

exports.clear = function() {
  eventList.length = 0
}
