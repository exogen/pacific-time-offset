/**
 * Detect Pacific Standard Time vs. Pacific Daylight Time, handling ONLY the
 * U.S. Pacific Time policy as of 2007.
 *
 * See the policy below. Note the correctness of this assumes you are inquiring
 * about a date in 2007 or later, for a territory in which this policy applies.
 * No other rules are accounted for.
 *
 * Wikipedia:
 *
 * Effective in the U.S. in 2007 as a result of the Energy Policy Act of 2005,
 * the local time changes from PST to PDT at 02:00 LST to 03:00 LDT on the
 * second Sunday in March and the time returns at 02:00 LDT to 01:00 LST on the
 * first Sunday in November. The Canadian provinces and territories that use
 * daylight time each adopted these dates between October 2005 and February
 * 2007. In Mexico, beginning in 2010, the portion of the country in this time
 * zone uses the extended dates, as do some other parts. The vast majority of
 * Mexico, however, still uses the old dates.
 */
var PST = -480;
var PDT = -420;

/**
 * Return the Pacific Standard Time or Pacific Daylight Time offset (-480 or
 * -420, the reverse sign of what would be returned by JavaScript's weird Date
 * `getTimezoneOffset()` method) depending on whether the given (or by default,
 * current) date falls within standard or daylight time.
 */
function pacificTimeOffset(date) {
  return isDaylightTime(date) ? PDT : PST;
}

/**
 * Return true if the given (or by default, current) date is within the Pacific
 * Daylight Time period per the U.S. policy effective 2007 (even if the date is
 * before then).
 */
function isDaylightTime(date) {
  if (typeof date === 'undefined') {
    date = new Date();
  }
  var month = date.getUTCMonth();
  var dayOfMonth = date.getUTCDate();
  var dayOfWeek = date.getUTCDay();
  var isSunday = dayOfWeek === 0;
  // What was the date of the most recent Sunday? Will be zero or negative if
  // there hasn't been a Sunday yet this month.
  var prevSundayDate = dayOfMonth - dayOfWeek;
  var hour = date.getUTCHours();

  switch (month) {
    // Jan-Feb is always PST.
    case 0:
    case 1:
      return false;
    // In March, switch to PDT after 2am PST on the second Sunday.
    case 2:
      if (prevSundayDate < 8) {
        // There has only been one or fewer Sundays.
        return false;
      } else if (isSunday && prevSundayDate < 15) {
        // It's the second Sunday, check the time!
        return hour >= 10;
      } else {
        // It's after the second Sunday.
        return true;
      }
    // Apr-Oct is always PDT.
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
      return true;
    // In November, switch back to PST after 2am PDT on the first Sunday.
    case 10:
      if (prevSundayDate < 1) {
        // It hasn't been Sunday yet.
        return true;
      } else if (isSunday && prevSundayDate < 8) {
        // It's the first Sunday, check the time!
        return hour < 9;
      } else {
        // It's after the first Sunday.
        return false;
      }
    case 11:
      // Dec is always PST.
      return false;
  }
}

pacificTimeOffset.PST = PST;
pacificTimeOffset.PDT = PDT;
pacificTimeOffset.isDaylightTime = isDaylightTime;

module.exports = pacificTimeOffset;
