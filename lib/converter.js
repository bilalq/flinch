exports.minutesToMilliseconds = function(minutes) {
  return Math.abs(parseInt(minutes, 10) * 60 * 1000);
};
