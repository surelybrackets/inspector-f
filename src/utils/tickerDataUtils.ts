import axios from 'axios'
import { utc, Moment } from 'moment'
import { getDateInYahooFinanceTime, validateDateRanges, getLatestDateInRange } from './dateUtils'
import {
    saveHistoricalTickerData,
    appendHistoricalTickerData,
    isTickerDataSaved,
    extractDateFromDataFilename,
} from './saveData'
import { logError } from './errorUtils'

import csv = require('csvtojson')

type YahooLinkOptions = { startDate?: number; endDate?: number; interval?: intervalOptions }

export const generateYahooDataLink = (ticker: string, options?: YahooLinkOptions): string => {
    const startDate: string = options && options.startDate ? `${options.startDate}` : `0`
    const endDate: string = options && options.endDate ? `${options.endDate}` : `${getDateInYahooFinanceTime()}`
    const interval: string = options && options.interval ? `${options.interval}` : '1d'

    return `https://query1.finance.yahoo.com/v7/finance/download/${ticker}?period1=${startDate}&period2=${endDate}&interval=${interval}&events=history`
}

type DataToLoad = { fileWriteDate: Moment; dataFile: string }

export const isMoreDataNeeded = (ticker: string, dateRange?: string): 'ALL' | DataToLoad | 'NONE' => {
    const dataFile = isTickerDataSaved(ticker)

    if (dataFile) {
        const today: Moment = utc()

        const fileWriteDate: Moment = extractDateFromDataFilename(dataFile)
        const lastDate: Moment = dateRange ? getLatestDateInRange(dateRange) : today

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

export const getTickerData = async (ticker: string, dateRange?: string): Promise<TickerInfo[] | string> => {
    if (dateRange && !validateDateRanges(dateRange)) {
        throw new Error('Invalid date range string')
    }

    const dataToLoad = isMoreDataNeeded(ticker, dateRange)

    if (dataToLoad === 'ALL') {
        return axios
            .get(generateYahooDataLink(ticker))
            .then(async (res) => {
                const data: TickerInfo[] = await csv().fromString(res.data).on('error', logError)
                return saveHistoricalTickerData(ticker, data)
            })
            .catch((err) => {
                logError(err)
                return `${err.response.status}: ${err.response.statusText}`
            })
    } else if (dataToLoad !== 'NONE') {
        const { fileWriteDate, dataFile } = dataToLoad
        const startDate: number = getDateInYahooFinanceTime(fileWriteDate.add(1, 'days'))
        return axios.get(generateYahooDataLink(ticker, { startDate })).then(async (res) => {
            const data = await csv().fromString(res.data).on('error', logError)
            return appendHistoricalTickerData(ticker, data)
        })
    }
}
