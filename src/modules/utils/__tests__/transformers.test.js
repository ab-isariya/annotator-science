const {
  datetimeToHuman,
  nowISOTime,
  humanFileSize,
  round,
  CommaFormatted,
  nFormatter,
  NumberCommaSuffix
} = require('../transformers');
const {DateTime} = require('luxon');

describe('datetimeToHuman()', () => {
  it('should convert the Orcarina of Time launch ISO formatted date to (MM/DD/YYYY)', () => {
    expect(
      datetimeToHuman(new Date(1998, 10, 21).toISOString(), DateTime.DATE_SHORT)
    ).toBe('11/21/1998');
  });

  it('should convert the Starfox 64 launch ISO formatted date to (MMMM DD, YYYY)', () => {
    const starfoxLaunchDate = new Date(1997, 3, 27).toISOString();

    expect(datetimeToHuman(starfoxLaunchDate, DateTime.DATE_FULL)).toBe(
      'April 27, 1997'
    );
  });
});

describe('nowISOTime()', () => {
  //NOTE(Rejon): Can sometimes fail if it's off by a split second.
  it('should format the current date to an ISO format without "Z"', () => {
    const _nowISOTime = nowISOTime();
    const _nowTime = new Date().toISOString().slice().slice(0, -1);

    expect(_nowISOTime).toBe(_nowTime);
  });
});

describe('huamnFileSize()', () => {
  //Bytes
  it('should format 1000 bytes to 1000.0B', () => {
    expect(humanFileSize(1000)).toBe('1000.0B');
  });

  //Kilobytes
  it('should format 10,000 bytes to 9.8kb', () => {
    expect(humanFileSize(10000)).toBe('9.8kB');
  });

  //Megabytes
  it('should format 10,000,000 bytes to 9.5MB', () => {
    expect(humanFileSize(10000000)).toBe('9.5MB');
  });

  //GigaBytes
  it('should format 100,000,000,000 bytes to 93.1GB', () => {
    expect(humanFileSize(100000000000)).toBe('93.1GB');
  });

  //TeraBytes
  it('should format 100,000,000,000,000 bytes to 90.9TB', () => {
    expect(humanFileSize(100000000000000)).toBe('90.9TB');
  });
});

describe('round()', () => {
  it('should round 15.55 to 16 with 0 decimals', () => {
    expect(round(15.55, 0)).toBe(16);
  });

  it('should round 15.5 to 15.5 with respect for 1 decimal', () => {
    expect(round(15.5, 1)).toBe(15.5);
  });

  it('should round 15.55 to 15.6 with respect for 1 decimal', () => {
    expect(round(15.55, 1)).toBe(15.6);
  });

  it('should round nowhere to 15 being the closest whole number', () => {
    expect(round(15, 0)).toBe(15);
  });
});

describe('CommaFormatted()', () => {
  it('should format 1000 to 1,000', () => {
    expect(CommaFormatted(1000)).toBe('1,000');
  });

  it('should NOT format 100 with commas', () => {
    expect(CommaFormatted(100)).toBe('100');
  });

  it('should format 123456 to 123,456', () => {
    expect(CommaFormatted(123456)).toBe('123,456');
  });

  it('should format 1234567890 to 1,234,567,890', () => {
    expect(CommaFormatted(1234567890)).toBe('1,234,567,890');
  });

  it('should format a max digits number with commas', () => {
    expect(CommaFormatted(12345678901234567890)).toBe(
      '12,345,678,901,234,567,000' //NOTE(Rejon): Testing number limits
    );
  });

  it('should return nothing if a number is NOT provided', () => {
    expect(CommaFormatted('A')).toBe('');
  });

  it('should return a negative number with commas', () => {
    expect(CommaFormatted(-1000)).toBe('-1,000');
  });

  it('should return a float with commas', () => {
    expect(CommaFormatted(1234.567)).toBe('1,234.567');
  });
});

describe('nFormatter()', () => {
  it('should form 100 to be 100', () => {
    expect(nFormatter(100, 0)).toBe('100');
  });

  it('should format 1000 as 1k shorthand', () => {
    expect(nFormatter(1000, 1)).toBe('1k');
  });

  it('should format 1001 past limit(1000) rounded to 1k', () => {
    expect(nFormatter(1001, 2)).toBe('1k');
  });

  it('should format 1010 past limit(1000) with 2 decimals as 1.01k', () => {
    expect(nFormatter(1010, 2)).toBe('1.01k');
  });

  it('should format 1001 past limit(1000) with 3 decimals as 1.001k', () => {
    expect(nFormatter(1001, 3)).toBe('1.001k');
  });

  it('should format 12345 past limit(1000) with 4 decimals as 12.345k', () => {
    expect(nFormatter(12345, 4)).toBe('12.345k');
  });

  it('should format 12345 past limit(1000) with 2 decimals as 12.35k', () => {
    expect(nFormatter(12345, 2)).toBe('12.35k');
  });

  it('should format 123456789 past limit(1000) with 2 decimals as 123.46M', () => {
    expect(nFormatter(123456789, 2)).toBe('123.46M');
  });
});

describe('NumberCommaSuffix()', () => {
  it('should format 1000 as 1,000', () => {
    expect(NumberCommaSuffix(1000, 1)).toBe('1,000');
  });

  it('should automatically format 1010 into shorthand past default limit(1000)', () => {
    expect(NumberCommaSuffix(1010, 1)).toBe('1k');
  });

  it('should format 1010 to 1,010 with upper limit of 2000', () => {
    expect(NumberCommaSuffix(1010, 1, 2000)).toBe('1,010');
  });

  it('should format 3456 to shorthand with limit of 2000 and 2 decimals', () => {
    expect(NumberCommaSuffix(3456, 2, 2000)).toBe('3.46k');
  });

  it('should format 3456 as 3,456 with upper limit of 4000', () => {
    expect(NumberCommaSuffix(3456, 2, 4000)).toBe('3,456');
  });

  it('should return nothing if a number is NOT provided', () => {
    expect(NumberCommaSuffix('A', 2, 4000)).toBe('');
  });
});
