import { utc, Moment } from 'moment'
import { logError } from './errorUtils'
import { TickerInfo } from '@surelybrackets/inspector-f_types'
import fs = require('fs')

export const dataRoute = 'data'

/**
 * Creates data director, where historical stock data can be stored.
 */
export const generateDataDirectory = (): void => {
    if (!fs.existsSync(dataRoute)) fs.mkdirSync(dataRoute)
}

/**
 * Returns the list of currently saved histocal stock data.
 */
export const getSavedDataList = (): string[] => {
    generateDataDirectory()
    return fs.readdirSync(dataRoute)
}

/**
 * Returns the saved file for ticker, if it exists.
 * @param ticker A stocker ticker symbol
 */
export const getSavedDataFileName = (ticker: string): string | undefined => {
    const dataFiles: string[] = getSavedDataList()
    return dataFiles.find((file: string): boolean => file.includes(ticker))
}

/**
 * Parses the data from a saved file and returns it as JSON.
 * @param file Name of a data file
 */
export const getDataFromFile = <T>(file: string): T[] => {
    generateDataDirectory()
    const oldData: string = fs.readFileSync(`${dataRoute}/${file}`, 'utf8')
    return JSON.parse(oldData)
}

/**
 * Saves the data for ticker.
 * @param ticker A stock ticker symbol
 * @param data Data to store for ticker
 */
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

/**
 * Gets the write date from saved data file
 * @param dataFile Name of a data file
 */
export const extractDateFromDataFilename = (dataFile: string): Moment => {
    const indexOfDate: number = dataFile.search(/\d/)
    const fileWriteDateString: string = dataFile.slice(indexOfDate, dataFile.length - 5)
    return utc(fileWriteDateString, 'YYYY_MM_DD')
}
