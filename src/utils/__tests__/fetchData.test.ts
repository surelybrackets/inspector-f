import { generateYahooDataLink, isMoreDataNeeded } from '../fetchData'
import { getDateInYahooFinanceTime } from '../dateUtils'
import { getSavedDataFileName } from '../saveData'
import { utc } from 'moment'

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
        expect(generateYahooDataLink(testTicker, { startDate: getDateInYahooFinanceTime(startDate) })).toBe(
            validationString,
        )
    })
    it('generates link with endDate', (): void => {
        const endDate = utc('2020_01_01', 'YYYY_MM_DD')
        const validationString = `https://query1.finance.yahoo.com/v7/finance/download/${testTicker}?period1=0&period2=${getDateInYahooFinanceTime(
            endDate,
        )}&interval=1d&events=history`
        expect(generateYahooDataLink(testTicker, { endDate: getDateInYahooFinanceTime(endDate) })).toBe(
            validationString,
        )
    })
    it('generates link with interval', (): void => {
        const interval: intervalOptions = '15m'
        const validationString = `https://query1.finance.yahoo.com/v7/finance/download/${testTicker}?period1=0&period2=${getDateInYahooFinanceTime(
            utc(),
        )}&interval=${interval}&events=history`
        expect(generateYahooDataLink(testTicker, { interval })).toBe(validationString)
    })
})

describe(`isMoreDataNeeded(ticker: string, dateRange?: string): 'ALL' | DataToLoad | 'NONE`, (): void => {
    const testTicker = 'aapl'
    it(`returns 'ALL' if datafile for ticker does not exist`, (): void => {
        // @ts-ignore
        getSavedDataFileName = jest.fn(() => undefined)
        expect(isMoreDataNeeded(testTicker).type).toBe('ALL')
    })
    it(`throws Error if date provide is in the future`, (done): void => {
        // @ts-ignore
        getSavedDataFileName = jest.fn(() => `${testTicker}${utc().format('YYYY_MM_DD')}.json`)
        const futureDate: string = utc().add(10, 'days').format('YYYY_MM_DD')
        try {
            isMoreDataNeeded(testTicker, futureDate)
            done.fail()
        } catch (e) {
            expect(e.message).toBe('Date is in the future')
            done()
        }
    })
    it(`returns DataToLoad info if ask date is later than most recent pull`, (): void => {
        const pastDate = utc().subtract(10, 'days')
        const oldFile = `${testTicker}${pastDate.format('YYYY_MM_DD')}.json`
        // @ts-ignore
        getSavedDataFileName = jest.fn(() => oldFile)
        const results = isMoreDataNeeded(testTicker)
        if (results.type !== 'ALL' && results.type !== 'NONE') {
            expect(results.dataFile).toBe(oldFile)
            expect(results.fileWriteDate.diff(pastDate, 'days')).toBe(0)
        }
    })
    it(`return 'NONE if ask date is earlier than most recent pull`, (): void => {
        const pastDate = utc().subtract(10, 'days').format('YYYY_MM_DD')
        // @ts-ignore
        getSavedDataFileName = jest.fn(() => `${testTicker}${utc().format('YYYY_MM_DD')}.json`)
        expect(isMoreDataNeeded(testTicker, pastDate).type).toBe('NONE')
    })
})
