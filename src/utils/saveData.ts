import { utc, Moment } from 'moment'
import fs = require('fs')

export const getSavedDataList = (): string[] => {
    return fs.readdirSync('data')
}

export const isTickerDataSaved = (ticker: string): string | undefined => {
    const dataFiles: string[] = getSavedDataList()
    return dataFiles.find((file: string): boolean => file.includes(ticker))
}

export const saveHistoricalTickerData = async (ticker: string, data: JSON[]): Promise<JSON[]> => {
    const today: Moment = utc()
    const todayString: string = today.format('YYYY_MM_DD')

    const oldDataFile: string = isTickerDataSaved(ticker)
    if (oldDataFile) {
        fs.unlink(oldDataFile, (err) => console.error(err))
    }

    fs.writeFile(`data/${ticker}${todayString}.json`, JSON.stringify(data), (err) => {
        if (err) console.error(err)
    })
    return data
}

export const appendHistoricalTickerData = async (ticker: string, data: JSON[]): Promise<JSON[]> => {
    const today: Moment = utc()
    const todayString: string = today.format('YYYY_MM_DD')
    const oldDataFile: string = isTickerDataSaved(ticker)
    if (oldDataFile) {
        try {
            const oldData: string = fs.readFileSync(`data/${oldDataFile}`, 'utf8')
            const oldDataJson: JSON[] = JSON.parse(oldData)
            data = oldDataJson.concat(data)
            fs.writeFile(`data/${ticker}${todayString}.json`, JSON.stringify(data), (err) => {
                if (err) console.error(err)
            })
        } catch (e) {
            throw new Error(`500 Internal Server Error: Failed to fetch data`)
        }
        fs.unlink(`data/${oldDataFile}`, (err) => {
            if (err) console.error(err)
        })
    } else {
        throw new Error(`500 Internal Server Error: Failed to fetch data`)
    }
    return data
}

export const extractDateFromDataFilename = (dataFile: string, ticker: string): Moment => {
    const fileWriteDateString: string = dataFile.slice(ticker.length, dataFile.length - 5)
    return utc(fileWriteDateString, 'YYYY_MM_DD')
}
