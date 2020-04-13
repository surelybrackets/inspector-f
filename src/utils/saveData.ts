import { utc, Moment } from 'moment'
import { logError } from './errorUtils'
import fs = require('fs')

export const dataRoute = 'data'

export const getSavedDataList = (): string[] => {
    return fs.readdirSync(dataRoute)
}

export const isTickerDataSaved = (ticker: string): string | undefined => {
    const dataFiles: string[] = getSavedDataList()
    return dataFiles.find((file: string): boolean => file.includes(ticker))
}

export const saveHistoricalTickerData = (ticker: string, data: TickerInfo[]): TickerInfo[] => {
    const todayString: string = utc().format('YYYY_MM_DD')

    const oldDataFile: string = isTickerDataSaved(ticker)
    if (oldDataFile) {
        fs.unlink(`${dataRoute}/${oldDataFile}`, logError)
    }

    fs.writeFile(`${dataRoute}/${ticker}${todayString}.json`, JSON.stringify(data), logError)
    return data
}

export const appendHistoricalTickerData = (ticker: string, data: TickerInfo[]): TickerInfo[] => {
    const today: Moment = utc()
    const todayString: string = today.format('YYYY_MM_DD')
    const oldDataFile: string = isTickerDataSaved(ticker)
    if (oldDataFile) {
        const oldData: string = fs.readFileSync(`${dataRoute}/${oldDataFile}`, 'utf8')
        const oldDataJson: TickerInfo[] = JSON.parse(oldData)
        data = oldDataJson.concat(data)
        fs.writeFile(`${dataRoute}/${ticker}${todayString}.json`, JSON.stringify(data), logError)
        fs.unlink(`${dataRoute}/${oldDataFile}`, logError)
    } else {
        throw new Error(`500 Internal Server Error: Failed to fetch data`)
    }
    return data
}

export const extractDateFromDataFilename = (dataFile: string): Moment => {
    const indexOfDate: number = dataFile.search(/\d/)
    const fileWriteDateString: string = dataFile.slice(indexOfDate, dataFile.length - 5)
    return utc(fileWriteDateString, 'YYYY_MM_DD')
}
