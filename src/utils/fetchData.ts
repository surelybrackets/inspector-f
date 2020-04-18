import axios from 'axios'
import { utc, Moment } from 'moment'
import { getDateInYahooFinanceTime, validateDateRanges, getLatestDateInRange } from './dateUtils'
import {
    saveHistoricalTickerData,
    appendHistoricalTickerData,
    getSavedDataFileName,
    extractDateFromDataFilename,
    getDataFromFile,
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

type DataToLoad = { type: 'ALL' | 'PARTIAL' | 'NONE'; fileWriteDate?: Moment; dataFile?: string }

export const isMoreDataNeeded = (ticker: string, dateRange?: string): DataToLoad => {
    const dataFile = getSavedDataFileName(ticker)

    if (dataFile) {
        const today: Moment = utc()

        const fileWriteDate: Moment = extractDateFromDataFilename(dataFile)
        const lastDate: Moment = dateRange ? getLatestDateInRange(dateRange) : today

        if (lastDate.diff(today, 'days') > 0) {
            throw new Error('Date is in the future')
        }
        if (lastDate.diff(fileWriteDate, 'days') > 0) {
            return { type: 'PARTIAL', fileWriteDate, dataFile }
        } else {
            return { type: 'NONE', fileWriteDate, dataFile }
        }
    } else {
        return { type: 'ALL' }
    }
}

export const getTickerData = async (ticker: string, dateRange?: string): Promise<TickerInfo[] | string> => {
    if (dateRange && !validateDateRanges(dateRange)) {
        throw new Error('Invalid date range string')
    }

    const dataToLoad = isMoreDataNeeded(ticker, dateRange)

    if (dataToLoad.type === 'ALL') {
        return await axios.get(generateYahooDataLink(ticker)).then(async (res) => {
            const data: TickerInfo[] = await csv().fromString(res.data).on('error', logError)
            return saveHistoricalTickerData(ticker, data)
        })
    } else if (dataToLoad.type === 'PARTIAL') {
        const startDate: number = getDateInYahooFinanceTime(dataToLoad.fileWriteDate.add(1, 'days'))
        try {
            return await axios.get(generateYahooDataLink(ticker, { startDate })).then(async (res) => {
                const data = await csv().fromString(res.data).on('error', logError)
                return appendHistoricalTickerData(ticker, data)
            })
        } catch (e) {
            if (e.response.data === '404 Not Found: Timestamp data missing.') {
                dataToLoad.type = 'NONE'
            } else throw e
        }
    }
    if (dataToLoad.type === 'NONE') {
        return getDataFromFile(dataToLoad.dataFile)
    }
}
