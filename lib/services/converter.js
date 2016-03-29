exports.minutesToMilliseconds = function(minutes) {
  return Math.abs(parseInt(minutes, 10) * 60000);
};

exports.millisecondsToMinutes = function(millseconds) {
  return Math.abs(parseInt(millseconds, 10)) / 60000;
};
