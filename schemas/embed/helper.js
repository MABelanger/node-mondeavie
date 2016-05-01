function validatePresenceOf(value) {
  if(typeof value === 'string' || typeof value === 'number' || value instanceof Date) {
      value = value.toString().trim();
  }
  return !!(value && value.length);
}


// 2016-04-17T00:01:00.000Z
function validateDate(value) {
  var isoValue = value.toISOString();
  var utcDateRegex = /(\d{4})-(\d{2})-(\d{2})T((\d{2}):(\d{2}):(\d{2}))\.(\d{3})Z/;
  var isValid = utcDateRegex.test(isoValue);
  return isValid;
}

var Helper = {
  validatePresenceOf : validatePresenceOf,
  validateDate: validateDate
};

module.exports = Helper;