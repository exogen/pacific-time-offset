# pacific-time-offset

Get the U.S. Pacific Time offset for the current or given date.

```console
$ yarn add pacific-time-offset
$ npm install pacific-time-offset
```

It **ONLY** supports:

- Pacific Time.
- U.S. policy effective 2007 onwards.

This will not necessarily be correct for dates before 2007 or for territories
where this policy does not apply.

## Usage

The default export is a function that will return either the Pacific Standard
Time or Pacific Daylight Time offset **as would be returned by JavaScript’s
`getTimezoneOffset()` method** – that is, 480 or 420.

All arguments are passed to the `Date` constructor. If no input is given, the
current date is used.

```js
import pacificTimeOffset from 'pacific-time-offset';

// 480 or 420, depending on current date.
pacificTimeOffset();
pacificTimeOffset(new Date());

// 480
pacificTimeOffset('2020-01-01T00:00:00.000Z');
pacificTimeOffset(new Date(2020, 0, 1));
pacificTimeOffset(1579296618326);
pacificTimeOffset(2020, 0, 15);

// 420
pacificTimeOffset('2020-06-01T00:00:00.000Z');
pacificTimeOffset(new Date(2020, 5, 1));
pacificTimeOffset(1594848671814);
pacificTimeOffset(2020, 6, 15);
```

If you just want to know whether the given date is in Pacific Standard Time or
Pacific Daylight Time and don’t care about the exact offset, there is also an
`isDaylightTime` helper:

```js
import { isDaylightTime } from 'pacific-time-offset';

// true
isDaylightTime('2020-06-01T00:00:00.000Z');

// false
isDaylightTime('2020-01-01T00:00:00.000Z');
```

## Motivation

JavaScript dates are always in the system’s current timezone, so the only
information available is the local timezone offset. It is very difficult to
determine information about other timezones without pulling in a full library
like [Moment](https://momentjs.com) or [Luxon](https://moment.github.io/luxon/)
which incorporate the full
[IANA time zone database](https://www.iana.org/time-zones) (or something like
it).

If you only care about U.S. Pacific Time policy and recent dates, this library
will be much, much smaller (even if you trim down builds of the above
libraries). This matters if you’re shipping the code in question to browsers.

## Alternatives

If you **know** you will only be running on platforms that support
[Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat),
have consistent locale/language support, and have data for the time zone you’re
interested in (implementations technically must only support GMT), then you may
be able to use that like so:

```js
const formatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Los_Angeles',
  timeZoneName: 'short'
});
const isDaylightTime = date => formatter.format(date).endsWith('PDT');
```

Again, support for this is implementation dependent. If you don’t want to worry
about the platform’s locale, time zone, and Intl support, use this library.
