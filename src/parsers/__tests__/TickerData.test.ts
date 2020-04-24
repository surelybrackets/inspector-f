import TickerData from '../TickerData'
import {
    getSavedDataFileName,
    getDataFromFile,
    extractDateFromDataFilename,
    saveHistoricalTickerData,
} from '../../utils/saveData'
import { dateFormat, validateDateRanges, isDateInDateRange } from '../../utils/dateUtils'
import { fetchTickerData } from '../../utils/fetchData'
import { utc, Moment } from 'moment'

const testTicker = 'aapl'
const testData: TickerInfo = {
    Date: '2020-04-09',
    Open: '30.280001',
    High: '32.299999',
    Low: '29.809999',
    Close: '30.330000',
    'Adj Close': '30.330000',
    Volume: '11335800',
}
const today: Moment = utc()
const testDate: Moment = utc('2020_01_01', dateFormat)

const testDataset = [
    {
        Date: '2019-05-10',
        Open: '42.000000',
        High: '45.000000',
        Low: '41.060001',
        Close: '41.570000',
        'Adj Close': '41.570000',
        Volume: '186322500',
    },
    {
        Date: '2019-05-13',
        Open: '38.790001',
        High: '39.240002',
        Low: '36.080002',
        Close: '37.099998',
        'Adj Close': '37.099998',
        Volume: '79442400',
    },
    {
        Date: '2019-05-14',
        Open: '38.310001',
        High: '39.959999',
        Low: '36.849998',
        Close: '39.959999',
        'Adj Close': '39.959999',
        Volume: '46661100',
    },
    {
        Date: '2019-05-15',
        Open: '39.369999',
        High: '41.880001',
        Low: '38.950001',
        Close: '41.290001',
        'Adj Close': '41.290001',
        Volume: '36086100',
    },
]

beforeEach((): void => {
    // @ts-ignore
    getSavedDataFileName = jest.fn(() => `aapl${today.format(dateFormat)}.json`)
    // @ts-ignore
    getDataFromFile = jest.fn(() => [testData])
    // @ts-ignore
    extractDateFromDataFilename = jest.fn(() => testDate)
})

describe('TickerData.constructor(ticker: string)', (): void => {
    it('constructor initializes properties', (): void => {
        const tickerData: TickerData = new TickerData(testTicker)
        expect(tickerData.ticker).toBe(testTicker)
        expect(tickerData.data).toStrictEqual([testData])
        expect(tickerData.lastPull.diff(today, 'days')).toBeLessThan(0)
        expect(tickerData.initializeDate.diff(today, 'days')).toBe(0)
    })
    it('constructor does not define last pull date, if file does not exist', (): void => {
        // @ts-ignore
        getSavedDataFileName = jest.fn(() => undefined)
        const tickerData: TickerData = new TickerData(testTicker)
        expect(tickerData.data).toStrictEqual([])
        expect(tickerData.lastPull).not.toBeDefined()
    })
})

describe('TickerData.isSynced(): boolean', (): void => {
    it('returns true if last pulled today', (): void => {
        // @ts-ignore
        extractDateFromDataFilename = jest.fn(() => today)
        const tickerData: TickerData = new TickerData(testTicker)
        expect(tickerData.isSynced()).toBe(true)
    })
    it('return false if last data pull was not today', (): void => {
        const tickerData: TickerData = new TickerData(testTicker)
        expect(tickerData.isSynced()).toBe(false)
    })
    it('returns false if data has never been pulled', (): void => {
        const tickerData: TickerData = new TickerData(testTicker)
        expect(tickerData.isSynced()).toBe(false)
    })
})

describe('TickerData.refreshDate(): Promise<TickerInfo[]>', () => {
    beforeEach((): void => {
        // @ts-ignore
        fetchTickerData = jest.fn(async () => [testData, testData])
        // @ts-ignore
        saveHistoricalTickerData = jest.fn()
    })
    it('returns the current stored data if the data is in sync', async (): Promise<void> => {
        const tickerData: TickerData = new TickerData(testTicker)
        tickerData.isSynced = jest.fn(() => true)
        expect(await tickerData.refreshData()).toStrictEqual([testData])
    })
    it('returns stored data + fetched data if out of sync', async (): Promise<void> => {
        const tickerData: TickerData = new TickerData(testTicker)
        tickerData.isSynced = jest.fn(() => false)
        // @ts-ignore
        extractDateFromDataFilename = jest.fn(() => testDate)
        expect(tickerData.lastPull.diff(today, 'days')).toBeLessThan(0)
        expect(await tickerData.refreshData()).toStrictEqual([testData, testData, testData])
        expect(tickerData.data).toStrictEqual([testData, testData, testData])
        expect(fetchTickerData).toHaveBeenCalledWith(testTicker, {
            startDate: testDate,
            endDate: tickerData.initializeDate,
        })
        expect(tickerData.lastPull.diff(today, 'days')).toBe(0)
        expect(saveHistoricalTickerData).toHaveBeenCalledWith(testTicker, [testData, testData, testData])
    })
})

describe('TickerData.filterData(dateRange?: string): TickerInfo[]', (): void => {
    beforeEach((): void => {
        // @ts-ignore
        getDataFromFile = jest.fn(() => testDataset)
    })
    it('returns unfiltered data if not give a dateRange string', (): void => {
        const tickerData: TickerData = new TickerData(testTicker)
        expect(tickerData.filterData()).toStrictEqual(testDataset)
    })
    it('throws error if provide dateRange is invalid', (done): void => {
        // @ts-ignore
        validateDateRanges = jest.fn(() => false)
        const tickerData: TickerData = new TickerData(testTicker)
        try {
            tickerData.filterData('2020_01_01')
            done.fail()
        } catch {
            done()
        }
    })
    it('filters data according to isDateInDateRange if given valid dateRange', (): void => {
        const filterDate = '2019_05_14'
        // @ts-ignore
        validateDateRanges = jest.fn(() => true)
        // @ts-ignore
        isDateInDateRange = jest.fn((day: Moment): boolean => {
            return day.diff(utc(filterDate, dateFormat), 'days') === 0
        })
        const tickerData: TickerData = new TickerData(testTicker)
        expect(tickerData.filterData(filterDate)).toStrictEqual([
            {
                Date: '2019-05-14',
                Open: '38.310001',
                High: '39.959999',
                Low: '36.849998',
                Close: '39.959999',
                'Adj Close': '39.959999',
                Volume: '46661100',
            },
        ])
    })
})

describe('TickerData:filterIndexes(dateRange?: string): number[]', (): void => {
    beforeEach((): void => {
        // @ts-ignore
        getDataFromFile = jest.fn(() => testDataset)
    })
    it('returns indexes of all data if not give a dateRange string', (): void => {
        const tickerData: TickerData = new TickerData(testTicker)
        expect(tickerData.filterIndexes()).toStrictEqual([0, 1, 2, 3])
    })
    it('throws error if provide dateRange is invalid', (done): void => {
        // @ts-ignore
        validateDateRanges = jest.fn(() => false)
        const tickerData: TickerData = new TickerData(testTicker)
        try {
            tickerData.filterIndexes('2020_01_01')
            done.fail()
        } catch {
            done()
        }
    })
    it('filters data according to isDateInDateRange if given valid dateRange', (): void => {
        const filterDate = '2019_05_14'
        // @ts-ignore
        validateDateRanges = jest.fn(() => true)
        // @ts-ignore
        isDateInDateRange = jest.fn((day: Moment): boolean => {
            return day.diff(utc(filterDate, dateFormat), 'days') === 0
        })
        const tickerData: TickerData = new TickerData(testTicker)
        expect(tickerData.filterIndexes(filterDate)).toStrictEqual([2])
    })
})
