import DateTime from 'luxon/src/datetime';

/**
 * Returns our UTC datetimes in a given format
 *
 * @param {String} datetimeStr
 * @param {Object} format - valid object to Luxon
 * https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html
 * @return {string}
 */
export function datetimeToHuman(datetimeStr, format) {
  return DateTime.fromISO(datetimeStr, {zone: 'utc'})
    .toLocal()
    .toLocaleString(format);
}

/**
 * Returns the current datetime as an ISO.
 *
 * NOTE! It removes the Z from the end because AWS RDS doesn't like keeping the Z
 * in it's records.
 *
 * @return {string}
 */
export function nowISOTime() {
  return new Date().toISOString().slice().slice(0, -1); //NOTE(Rejon): Drop the Z!;
}

/**
 * Returns size in human readable units
 *
 * @param {Number} sizeInBytes - size in bytes
 * @return {String} human readable size and the unit
 */
export function humanFileSize(sizeInBytes) {
  const i =
    sizeInBytes === 0 ? 0 : Math.floor(Math.log(sizeInBytes) / Math.log(1024));
  return (
    (sizeInBytes / Math.pow(1024, i)).toFixed(1) +
    ['B', 'kB', 'MB', 'GB', 'TB'][i]
  );
}

/**
 * Rounding function that avoids the problem of decimal of 5 rounded down
 * instead of up
 *
 * @param {Number} value
 * @param {Number} decimals
 * @return {number}
 */
export function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

/**
 * Formats a number (integer or float) into a string with comma
 * separators. Also handles decimals for floats.

 * @param {number} amount - Number to be formatted
 * @return {string}
 */
export const CommaFormatted = (amount) => {
  var delimiter = ','; // replace comma if desired
  var a = String(amount).split('.', 2);
  var d = a[1];
  var i = parseInt(a[0]);
  if (isNaN(i)) {
    return '';
  }
  var minus = '';
  if (i < 0) {
    minus = '-';
  }
  i = Math.abs(i);
  var n = String(i);
  a = [];
  while (n.length > 3) {
    var nn = n.substr(n.length - 3);
    a.unshift(nn);
    n = n.substr(0, n.length - 3);
  }
  if (n.length > 0) {
    a.unshift(n);
  }
  n = a.join(delimiter);
  if (d === undefined || d.length < 1) {
    amount = n;
  } else {
    amount = n + '.' + d;
  }
  amount = minus + amount;
  return amount;
};

/**
 * Formats a number to a shortend place (ie. 1,000 becomes 1.0k)
 * //From: https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900
 * @constructor
 * @param {number} num - Number to be formatted.
 * @param {number} digits - Amount of digits to support when formatting (ie. 10,080 with 3 digits -> 10.1k with 4 digits -> 10.05k)
 * @return {string}
 */
export const nFormatter = (num, digits) => {
  var si = [
    {value: 1, symbol: ''},
    {value: 1e3, symbol: 'k'},
    {value: 1e6, symbol: 'M'},
    {value: 1e9, symbol: 'G'},
    {value: 1e12, symbol: 'T'},
    {value: 1e15, symbol: 'P'},
    {value: 1e18, symbol: 'E'}
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
};

/**
 * Formatter that combines nFormatter and CommaFormatted
 * based on a limit. If num is less than the limit, it'll be comma formatted,
 * else, it'll be nFormatted.
 * NOTE: limit is 1000 by default
 *
 * @param {number} num - Number to be formatted.
 * @param {number} digits - Number of digits to show for nFormatted
 * @param {number} limit (Default: 1000) - Limit to change the format from CommaSeperated into nFormatted.
 * @return {string}
 */
export const NumberCommaSuffix = (num, digits, limit = 1000) => {
  if (isNaN(num)) {
    return '';
  }

  if (num <= limit) {
    return CommaFormatted(String(num));
  } else {
    return nFormatter(num, digits);
  }
};
