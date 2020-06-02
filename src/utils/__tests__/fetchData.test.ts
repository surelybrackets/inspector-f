import { getDateInYahooFinanceTime, generateYahooDataLink, parseCSV, fetchTickerData } from '../fetchData'
import { TickerInfo, IntervalOptions } from '@surelybrackets/inspector-f_types'
import axios from 'axios'
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
        const interval: IntervalOptions = '15m'
        const validationString = `https://query1.finance.yahoo.com/v7/finance/download/${testTicker}?period1=0&period2=${getDateInYahooFinanceTime(
            utc(),
        )}&interval=${interval}&events=history`
        expect(generateYahooDataLink(testTicker, { interval })).toBe(validationString)
    })
})

describe('parseCSV(dataCSV: string): Promise<TickerInfo[]>', () => {
    it('it returns csv string to json', async (): Promise<void> => {
        const csv = 'Header1,Header2,Header3\n1,2,3\n4,5,6'
        const expectedJson = [
            {
                Header1: '1',
                Header2: '2',
                Header3: '3',
            },
            {
                Header1: '4',
                Header2: '5',
                Header3: '6',
            },
        ]
        const json = await parseCSV(csv)
        expect(json).toStrictEqual(expectedJson)
    })
})

describe('fetchTickerData(ticker: string, options?: YahooLinkOptions): Promise<TickerInfo>', (): void => {
    it('calls functions needs to produce ticker data in JSON[] format', async (): Promise<void> => {
        const testLink = `https://query1.finance.yahoo.com/v7/finance/download/aapl?period1=0&period2=111111111&interval=1d&events=history`
        const testResponse = {
            data:
                'Date,Open,High,Low,Close,Adj Close,Volume\n2020-04-09,30.280001,32.299999,29.809999,30.330000,30.330000,11335800',
        }
        const testData: TickerInfo = {
            Date: '2020-04-09',
            Open: '30.280001',
            High: '32.299999',
            Low: '29.809999',
            Close: '30.330000',
            'Adj Close': '30.330000',
            Volume: '11335800',
        }
        // @ts-ignore
        generateYahooDataLink = jest.fn(() => testLink)
        // @ts-ignore
        axios.get = jest.fn(async () => testResponse)
        // @ts-ignore
        parseCSV = jest.fn(async () => testData)

        const testTicker = 'aapl'
        const testOptions = { startDate: utc() }
        const result = await fetchTickerData(testTicker, testOptions)
        expect(generateYahooDataLink).toHaveBeenCalledWith(testTicker, testOptions)
        expect(axios.get).toHaveBeenCalledWith(testLink, {})
        expect(parseCSV).toHaveBeenCalledWith(testResponse.data)
        expect(result).toStrictEqual(testData)
    })
})
