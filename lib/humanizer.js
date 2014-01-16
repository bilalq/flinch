var padZeroes = function(val) {
  return ('0' + val).slice(-2);
};

exports.date = function(date) {
  date = date || new Date();

  var readableDate = '[';
  readableDate += date.getFullYear() + '-' +
    padZeroes(date.getMonth() + 1) + '-' +
    padZeroes(date.getDate()) + ' ' +
    padZeroes(date.getHours()) + ':' +
    padZeroes(date.getMinutes()) + ':' +
    padZeroes(date.getSeconds()) + ']';
  return readableDate;
};
