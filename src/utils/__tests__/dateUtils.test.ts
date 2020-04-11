import {
    getDateInYahooFinanceTime,
    validateDateString,
    validateRange,
    validateDateRanges,
    getLatestDateInRange,
} from '../dateUtils'
import { utc, Moment } from 'moment'

describe('getDateinYahooFinanceTime(date: Moment): number', (): void => {
    const yahooTimeSlope = 86400
    const apr3rdInYahooTime: number = yahooTimeSlope * 18355
    it('returns today in yahoo finance time', (): void => {
        const todayInYahooTime: number = getDateInYahooFinanceTime()
        const daysSinceApr3: number = utc().diff(utc('2020_04_03', 'YYYY_MM_DD'), 'days')
        const diffTodayApr3: number = todayInYahooTime - apr3rdInYahooTime
        expect(diffTodayApr3 / yahooTimeSlope).toBe(daysSinceApr3)
    })
    it('returns date before apr. 3 in yahoo time', (): void => {
        const testDate: Moment = utc('2019_01_01', 'YYYY_MM_DD')
        const testDateInYahooTime: number = getDateInYahooFinanceTime(testDate)
        const daysSinceApr3: number = testDate.diff(utc('2020_04_03', 'YYYY_MM_DD'), 'days')
        const diffTestDateApr3: number = testDateInYahooTime - apr3rdInYahooTime
        expect(diffTestDateApr3 / yahooTimeSlope).toBe(daysSinceApr3)
    })
})

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
