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
Time or Pacific Daylight Time offset (from UTC) in minutes, either -480 or -420,
depending on which applies to the given date. **Note that this is the reverse of
what JavaScript’s weird Date `getTimezoneOffset()` method would return, which is
the offset _to_ UTC.**

If an argument is supplied, it must be a Date instance.

```js
import pacificTimeOffset from 'pacific-time-offset';

// -480 or -420, depending on current date.
pacificTimeOffset();
pacificTimeOffset(new Date());

// -480
pacificTimeOffset(new Date('2020-01-01T00:00:00.000Z'));
pacificTimeOffset(new Date(2020, 0, 1));
pacificTimeOffset(new Date(1579296618326));
pacificTimeOffset(new Date(2020, 0, 15));

// -420
pacificTimeOffset(new Date('2020-06-01T00:00:00.000Z'));
pacificTimeOffset(new Date(2020, 5, 1));
pacificTimeOffset(new Date(1594848671814));
pacificTimeOffset(new Date(2020, 6, 15));
```

### Helpers

Available on the exported `pacificTimeOffset` function.

#### PST

The value -480. You could use this for expressions like
`pacificTimeOffset() === PST`, for example.

#### PDT

The value -420. You could use this for expressions like
`pacificTimeOffset() === PDT`, for example.

#### isDaylightTime

If you just want to know whether the given date is in Pacific Standard Time or
Pacific Daylight Time and don’t care about the exact offset, there is also an
`isDaylightTime` helper:

```js
import { isDaylightTime } from 'pacific-time-offset';

// true
isDaylightTime(new Date('2020-06-01T00:00:00.000Z'));

// false
isDaylightTime(new Date('2020-01-01T00:00:00.000Z'));
```

## Motivation

JavaScript dates are always in the system’s current time zone, so the only
information available is the local time zone offset. It is very difficult to
determine information about other time zones without pulling in a full library
like [Moment](https://momentjs.com) or [Luxon](https://moment.github.io/luxon/)
which incorporate the full
[IANA time zone database](https://www.iana.org/time-zones) (or something like
it).

If you only care about U.S. Pacific Time policy and recent dates, this library
will be much, much smaller (even if you trim down builds of the above
libraries). This matters if you’re shipping the code in question to browsers.

## Why would I use this?

Sometimes you have business functions that consider dates in a specific time
zone, not necessarily the user’s local time zone. For instance, maybe you’re
running an e-commerce site where timed messages, promotions, etc. are all based
on the company’s “official current time” in a specific time zone. If you have
applications running on user’s devices (like in their web browser), then how do
you tell what time it is in that time zone? Well, if that time zone happens to
be Pacific Time, you’re in luck – that’s what this does.

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
