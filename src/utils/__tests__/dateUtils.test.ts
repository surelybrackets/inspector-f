import {
    dateFormat,
    validateDateString,
    validateRange,
    validateDateRanges,
    getLatestDateInRange,
    isDateInDateRange,
} from '../dateUtils'
import { utc, Moment } from 'moment'

describe('validateDateString(dateString: string): boolean', (): void => {
    it('return true for valid string', (): void => {
        const testString = '2020_03_14'
        expect(validateDateString(testString)).toBe(true)
    })
    it('returns false if given string not 10 characters long', (): void => {
        const testStrings = ['1234', '12345678910']
        testStrings.forEach((item: string) => {
            expect(validateDateString(item)).toBe(false)
        })
    })
    it('returns false for invalid characters', (): void => {
        const testStrings = ['2020_!9_N0', '1u23_oi_09', 'asfd_er_di', '2020-10-02']
        testStrings.forEach((item: string) => {
            expect(validateDateString(item)).toBe(false)
        })
    })
    it('returns false for improperly formated strings', (): void => {
        const testStrings = ['202_839_39', '_9302_3_39', '0123456789']
        testStrings.forEach((item: string) => {
            expect(validateDateString(item)).toBe(false)
        })
    })
    it('returns false if date is invalid', (): void => {
        const testStrings = ['2020_13_45', '2019_02_29']
        testStrings.forEach((item: string) => {
            expect(validateDateString(item)).toBe(false)
        })
    })
})

describe('validateRange(range: string): boolean', (): void => {
    beforeEach((): void => {
        // @ts-ignore
        validateDateString = jest.fn(() => true)
    })
    it('called with a single dateString, calls validateDateString', (): void => {
        const testString = '2020_09_12'
        validateRange(testString)
        expect(validateDateString).toHaveBeenCalledWith(testString)
    })
    it('called with range, calls validateDateString with start/end values', (): void => {
        const testString = '2020_09_12-2020_10_12'
        validateRange(testString)
        expect(validateDateString).toBeCalledTimes(2)
        expect(validateDateString).nthCalledWith(1, testString.split('-')[0])
        expect(validateDateString).nthCalledWith(2, testString.split('-')[1])
    })
    it('called with range, if a validateDateString call fails return false', (): void => {
        // @ts-ignore
        validateDateString = jest.fn(() => false)
        const testString = '2020_09_12-2020_10_12'
        expect(validateRange(testString)).toBe(false)
    })
    it('called with range, fails if startDate > endDate', (): void => {
        const testString = '2020_10_12-2020_09_12'
        expect(validateRange(testString)).toBe(false)
    })
    it('called with a range with multiple delimiters returns false', (): void => {
        const testString = '2020_09_12-2020_10_12-2020_11_12'
        expect(validateRange(testString)).toBe(false)
    })
})

describe('validateDateRanges(dateRanges: string): boolean', (): void => {
    it('calls validateRange for every dateRange in string', (): void => {
        // @ts-ignore
        validateRange = jest.fn(() => true)
        const testString = '2020_02_01,2019_10_22-2019_20_30,2017_04_17'
        validateDateRanges(testString)
        expect(validateRange).toHaveBeenNthCalledWith(1, '2020_02_01')
        expect(validateRange).toHaveBeenNthCalledWith(2, '2019_10_22-2019_20_30')
        expect(validateRange).toHaveBeenNthCalledWith(3, '2017_04_17')
    })
    it('returns false if one of the validateRange calls fails', (): void => {
        // @ts-ignore
        validateRange = jest.fn(() => false)
        const testString = '2020_02_01,2019_10_22-2019_20_30,2017_04_17'
        expect(validateDateRanges(testString)).toBe(false)
    })
})

describe('getLatestDateInRange(dateRange: string): Momemnt', (): void => {
    it('returns late date in date range', (): void => {
        const testStrings = [
            ['2020_10_12', '2020_10_12'],
            ['2020_10_12-2020_11_12', '2020_11_12'],
            ['2020_02_01,2019_10_22-2019_20_30,2017_04_17', '2020_02_01'],
            ['2020_01_01-2020_12_31, 2019_01_01-2019_2019_12_31', '2020_12_31'],
        ]
        testStrings.forEach((item: string[]) => {
            expect(getLatestDateInRange(item[0])).toStrictEqual(utc(item[1], 'YYYY_MM_DD'))
        })
    })
})

describe('isDateInDateRange(date: Moment, dateRange: string): boolean', (): void => {
    it('returns true for single date that matches', (): void => {
        const testDate = utc('2000_01_01', dateFormat)
        const testDateRange = '2000_01_01'
        expect(isDateInDateRange(testDate, testDateRange)).toBe(true)
    })
    it("returns false for single date that doesn't matach", (): void => {
        const testDate = utc('2010_12_31', dateFormat)
        const testDateRange = '2000_01_01'
        expect(isDateInDateRange(testDate, testDateRange)).toBe(false)
    })
    it('return true for dates within defined range', (): void => {
        const testDates: Moment[] = [
            utc('2000_01_01', dateFormat),
            utc('1999_01_01', dateFormat),
            utc('2001_01_01', dateFormat),
        ]
        const testDateRange = '1999_01_01-2001_01_01'
        testDates.forEach((testDate: Moment) => {
            expect(isDateInDateRange(testDate, testDateRange)).toBe(true)
        })
    })
    it('returns false for dates outside of defined range', (): void => {
        const testDates: Moment[] = [utc('2002_01_01', dateFormat), utc('1998_01_01', dateFormat)]
        const testDateRange = '1999_01_01-2001_01_01'
        testDates.forEach((testDate: Moment) => {
            expect(isDateInDateRange(testDate, testDateRange)).toBe(false)
        })
    })
    it('accepts list of dateRanges', (): void => {
        const testDates: [Moment, boolean][] = [
            [utc('2002_01_01', dateFormat), true],
            [utc('1998_01_01', dateFormat), false],
            [utc('2020_12_31', dateFormat), false],
            [utc('2000_01_01', dateFormat), true],
        ]
        const testDateRange = '1998_12_31,1999_01_01-2001_01_01,2002_01_01'
        testDates.forEach(([testDate, shouldPass]) => {
            expect(isDateInDateRange(testDate, testDateRange)).toBe(shouldPass)
        })
    })
})
