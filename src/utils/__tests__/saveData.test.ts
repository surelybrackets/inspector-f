import {
    dataRoute,
    getSavedDataList,
    getSavedDataFileName,
    getDataFromFile,
    extractDateFromDataFilename,
    saveHistoricalTickerData,
} from '../saveData'
import fs = require('fs')
import { utc } from 'moment'

// @ts-ignore
fs.unlink = jest.fn(fs.unlinkSync)
// @ts-ignore
fs.writeFile = jest.fn(fs.writeFileSync)
const testFiles = ['aapl2020_04_03.json', 'msft2020_04_03.json']
// @ts-ignore
dataRoute = 'test_data'
const testData: TickerInfo = {
    Date: '2020-04-09',
    Open: '30.280001',
    High: '32.299999',
    Low: '29.809999',
    Close: '30.330000',
    'Adj Close': '30.330000',
    Volume: '11335800',
}
beforeAll((): void => {
    fs.mkdirSync(dataRoute)
    testFiles.forEach((file: string) => {
        fs.writeFileSync(`${dataRoute}/${file}`, JSON.stringify([testData]))
    })
})

afterAll((): void => {
    getSavedDataList().forEach((item: string): void => {
        fs.unlinkSync(`${dataRoute}/${item}`)
    })
    fs.rmdirSync(dataRoute)
})

describe('getSavedDataList(): string[]', (): void => {
    it('returns list of saved files', (): void => {
        expect(getSavedDataList()).toEqual(testFiles)
    })
})

describe('getSavedDataFileName(ticker: string): string | undefined', (): void => {
    it('returns data filename if data file exists', (): void => {
        expect(getSavedDataFileName('aapl')).toBe(testFiles[0])
        expect(getSavedDataFileName('msft')).toBe(testFiles[1])
    })
    it('returns undefined if data file does not exist', (): void => {
        expect(getSavedDataFileName('tsla')).not.toBeDefined()
    })
})

describe('extractDateFromDataFileName(dataFile: string, ticker: string): Moment', (): void => {
    it('returns date from dataFile name', (): void => {
        expect(extractDateFromDataFilename(testFiles[0])).toStrictEqual(utc('2020_04_03', 'YYYY_MM_DD'))
        expect(extractDateFromDataFilename(testFiles[1])).toStrictEqual(utc('2020_04_03', 'YYYY_MM_DD'))
    })
})

describe('getDataFromFile(file: string): TickerInfo[]', (): void => {
    it('gets data from existing file', (): void => {
        const testFile = 'aapl2020_04_03.json'
        expect(getDataFromFile(testFile)).toStrictEqual([testData])
    })
    it('errors for invalid file', (done): void => {
        const testFile = 'tsla2020_04_03.json'
        try {
            getDataFromFile(testFile)
            done.fail()
        } catch (e) {
            expect(e).toBeDefined()
            done()
        }
    })
})

describe('saveHistoricallTickerData(ticker: string, data: TickerInfo[]): Promise<void>', (): void => {
    it('saves data if file does not exist', (): void => {
        const testTicker = 'uber'
        const data = saveHistoricalTickerData(testTicker, [testData, testData])
        const expectedFormat = `${testTicker}${utc().format('YYYY_MM_DD')}.json`
        expect(getSavedDataFileName(testTicker)).toBe(expectedFormat)
        expect(data).toStrictEqual([testData, testData])
    })
    it('deletes old data file if exists', (): void => {
        const testTicker = 'aapl'
        saveHistoricalTickerData(testTicker, [testData, testData])
        const expectedFormat = `${testTicker}${utc().format('YYYY_MM_DD')}.json`
        expect(getSavedDataFileName(testTicker)).toBe(expectedFormat)
        expect(fs.unlink).toHaveBeenCalledWith(`${dataRoute}/${testFiles[0]}`, expect.any(Function))
    })
})
