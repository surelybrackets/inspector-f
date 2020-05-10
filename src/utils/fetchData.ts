import axios from 'axios'
import { utc, Moment } from 'moment'
import { logError } from './errorUtils'

import csv = require('csvtojson')

/**
 * Returns a date in the number format Yahoo finance uses.
 * @param date A date
 */
export const getDateInYahooFinanceTime = (date: Moment = utc()): number => {
    /* y = 86400x */
    const slope = 86400
    /* x (Apr 3, 2020) = 18355 */
    const base = 18355
    const apr3rd2020: Moment = utc('2020_04_03', 'YYYY_MM_DD')

    const daydSinceApr3: number = date.diff(apr3rd2020, 'days')

    return slope * (base + daydSinceApr3)
}

type YahooLinkOptions = { startDate?: Moment; endDate?: Moment; interval?: intervalOptions }

/**
 * Returns a link to download data related to a specific stock ticker from yahoo finance
 * @param ticker A stocker ticker symbol
 * @param options Options to filter the data returned by yahoo finance
 */
export const generateYahooDataLink = (ticker: string, options?: YahooLinkOptions): string => {
    const startDate: string = options && options.startDate ? `${getDateInYahooFinanceTime(options.startDate)}` : `0`
    const endDate: string =
        options && options.endDate ? `${getDateInYahooFinanceTime(options.endDate)}` : `${getDateInYahooFinanceTime()}`
    const interval: string = options && options.interval ? `${options.interval}` : '1d'

    return `https://query1.finance.yahoo.com/v7/finance/download/${ticker}?period1=${startDate}&period2=${endDate}&interval=${interval}&events=history`
}

/**
 * Converts a csv string into JSON[]
 * @param dataCSV A comma seperated string of data
 */
export const parseCSV = async <T>(dataCSV: string): Promise<T[]> => {
    return await csv().fromString(dataCSV).on('error', logError)
}

/**
 * Fetches historical trading data related to ticker
 * @param ticker A stock ticker symbol
 * @param options Options to filter the data returned by yahoo finance
 */
export const fetchTickerData = async (ticker: string, options?: YahooLinkOptions): Promise<TickerInfo[]> => {
    const getString: string = generateYahooDataLink(ticker, options)
    return await axios.get(getString, {}).then(async (res) => await parseCSV<TickerInfo>(res.data))
}
