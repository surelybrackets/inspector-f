import axios from 'axios'
import { getDateInYahooFinanceTime, validateDateRanges, getLatestDateInRange, normalizeDate } from './dateUtils'
import { saveHistoricalTickerData, isTickerDataSaved, extractDateFromDataFilename } from './saveData'

const fs = require('fs')

const csv = require('csvtojson')

export const generateYahooDataLink = (ticker: string, range?: { startDate?: number, endDate?: number, interval: number }): string => {
    let startDate: string = range && range.startDate ? `${range.startDate}` : `0`
    let endDate: string = range && range.endDate ? `${range.endDate}` : `${getDateInYahooFinanceTime()}`
    let interval: string = range && range.interval ? `${range.interval}` : '1'

    return `https://query1.finance.yahoo.com/v7/finance/download/${ticker}?period1=${startDate}&period2=${endDate}&interval=${interval}d&events=history`
}

export const isMoreDataNeeded = (ticker: string, dateRange?: string): 'ALL' | 'PARTIAL' | 'NONE' => {
    const dataFile = isTickerDataSaved(ticker)

    if (dataFile) {
        const today = normalizeDate(new Date())
        const fileWriteDate: Date = extractDateFromDataFilename(dataFile, ticker)
        const lastDate: Date = dateRange ? getLatestDateInRange(dateRange) : today
        console.log(normalizeDate(lastDate))
        console.log(today)

        if (normalizeDate(lastDate) > today) {
            throw new Error('Date is in the future')
        }
        if (lastDate > fileWriteDate) {
            return 'PARTIAL'
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
            saveHistoricalTickerData(ticker, data)
            return data
        }).catch((err: any) => {
            console.error(err)
            return `${err.response.status}: ${err.response.statusText}`
        })
    } else if (dataToLoad === 'PARTIAL') {

    }

}
