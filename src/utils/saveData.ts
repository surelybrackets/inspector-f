import { utc, Moment } from 'moment'
import { logError } from './errorUtils'
import fs = require('fs')

export const dataRoute = 'data'

export const generateDataDirectory = (): void => {
    if (!fs.existsSync(dataRoute)) fs.mkdirSync(dataRoute)
}

export const getSavedDataList = (): string[] => {
    generateDataDirectory()
    return fs.readdirSync(dataRoute)
}

export const getSavedDataFileName = (ticker: string): string | undefined => {
    const dataFiles: string[] = getSavedDataList()
    return dataFiles.find((file: string): boolean => file.includes(ticker))
}

export const getDataFromFile = (file: string): TickerInfo[] => {
    generateDataDirectory()
    const oldData: string = fs.readFileSync(`${dataRoute}/${file}`, 'utf8')
    return JSON.parse(oldData)
}

export const saveHistoricalTickerData = (ticker: string, data: TickerInfo[]): TickerInfo[] => {
    generateDataDirectory()
    const todayString: string = utc().format('YYYY_MM_DD')

    const oldDataFile: string = getSavedDataFileName(ticker)
    if (oldDataFile) {
        fs.unlink(`${dataRoute}/${oldDataFile}`, logError)
    }

    fs.writeFile(`${dataRoute}/${ticker}${todayString}.json`, JSON.stringify(data), logError)
    return data
}

export const extractDateFromDataFilename = (dataFile: string): Moment => {
    const indexOfDate: number = dataFile.search(/\d/)
    const fileWriteDateString: string = dataFile.slice(indexOfDate, dataFile.length - 5)
    return utc(fileWriteDateString, 'YYYY_MM_DD')
}
