import axios from 'axios'
import * as moment from "moment"
import { getDateInYahooFinanceTime, validateDateRanges, getLatestDateInRange } from './dateUtils'
import { saveHistoricalTickerData, appendHistoricalTickerData, isTickerDataSaved, extractDateFromDataFilename } from './saveData'

const csv = require('csvtojson')

type intervalOptions = '1m' | '2m' | '5m' | '15m' | '30m' | '60m' | '90m' | '1h' | '1d' | '5d' | '1wk' | '1mo' | '3mo'

export const generateYahooDataLink = (ticker: string, options?: { startDate?: number, endDate?: number, interval?: intervalOptions }): string => {
    let startDate: string = options && options.startDate ? `${options.startDate}` : `0`
    let endDate: string = options && options.endDate ? `${options.endDate}` : `${getDateInYahooFinanceTime()}`
    let interval: string = options && options.interval ? `${options.interval}` : '1d'

    return `https://query1.finance.yahoo.com/v7/finance/download/${ticker}?period1=${startDate}&period2=${endDate}&interval=${interval}&events=history`
}

export const isMoreDataNeeded = (ticker: string, dateRange?: string): 'ALL' | { fileWriteDate: moment.Moment, dataFile: string } | 'NONE' => {
    const dataFile = isTickerDataSaved(ticker)

    if (dataFile) {
        const today: moment.Moment = moment.utc()
        const fileWriteDate: moment.Moment = extractDateFromDataFilename(dataFile, ticker)
        const lastDate: moment.Moment = dateRange ? getLatestDateInRange(dateRange) : today

        if (lastDate.diff(today, 'days') > 0) {
            throw new Error('Date is in the future')
        }
        if (lastDate.diff(fileWriteDate) > 0) {
            return { fileWriteDate, dataFile }
        } else {
            return 'NONE'
        }
    } else {
        return 'ALL'
    }
}

export const getTickerData = async (ticker: string, dateRange?: string): Promise<Object> => {
    if (dateRange && !validateDateRanges(dateRange)) {
        throw new Error('Invalid date range string')
    }

    const dataToLoad = isMoreDataNeeded(ticker, dateRange)

    if (dataToLoad === 'ALL') {
        return axios.get(generateYahooDataLink(ticker)).then(async (res: any) => {
            const data = await csv().fromString(res.data).on('error', (err: any) => {
                console.error(err)
            })
            return saveHistoricalTickerData(ticker, data)
        }).catch((err: any) => {
            console.error(err)
            return `${err.response.status}: ${err.response.statusText}`
        })
    } else if (dataToLoad !== 'NONE') {
        const { fileWriteDate, dataFile } = dataToLoad
        const startDate: number = getDateInYahooFinanceTime(fileWriteDate.add(1, 'days'))
        return axios.get(generateYahooDataLink(ticker, { startDate })).then(async (res: any) => {
            const data = await csv().fromString(res.data).on('error', (err: any) => {
                console.error(err)
            })
            return appendHistoricalTickerData(ticker, data)
        })
    }

}
