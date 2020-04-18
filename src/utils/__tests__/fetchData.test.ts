import { getDateInYahooFinanceTime, generateYahooDataLink } from '../fetchData'
import { getSavedDataFileName } from '../saveData'
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

describe('generateYahooDataLink(ticker: string, options?: YahooLinkOptions): string', (): void => {
    const testTicker = 'aapl'
    it('generates link with default values and today', (): void => {
        const validationString = `https://query1.finance.yahoo.com/v7/finance/download/${testTicker}?period1=0&period2=${getDateInYahooFinanceTime(
            utc(),
        )}&interval=1d&events=history`
        expect(generateYahooDataLink(testTicker)).toBe(validationString)
    })
    it('generates link with startDate', (): void => {
        const startDate = utc('2020_01_01', 'YYYY_MM_DD')
        const validationString = `https://query1.finance.yahoo.com/v7/finance/download/${testTicker}?period1=${getDateInYahooFinanceTime(
            startDate,
        )}&period2=${getDateInYahooFinanceTime(utc())}&interval=1d&events=history`
        expect(generateYahooDataLink(testTicker, { startDate })).toBe(validationString)
    })
    it('generates link with endDate', (): void => {
        const endDate = utc('2020_01_01', 'YYYY_MM_DD')
        const validationString = `https://query1.finance.yahoo.com/v7/finance/download/${testTicker}?period1=0&period2=${getDateInYahooFinanceTime(
            endDate,
        )}&interval=1d&events=history`
        expect(generateYahooDataLink(testTicker, { endDate })).toBe(validationString)
    })
    it('generates link with interval', (): void => {
        const interval: intervalOptions = '15m'
        const validationString = `https://query1.finance.yahoo.com/v7/finance/download/${testTicker}?period1=0&period2=${getDateInYahooFinanceTime(
            utc(),
        )}&interval=${interval}&events=history`
        expect(generateYahooDataLink(testTicker, { interval })).toBe(validationString)
    })
})
