import axios from 'axios'
import { getDateInYahooFinanceTime } from './dateCalcs'
import { saveHistoricalTickerData } from './saveData'

const fs = require('fs')

const csv = require('csvtojson')

export const generateYahooDataLink = (ticker: string, range?: { startDate?: number, endDate?: number, interval: number }): string => {
    let startDate: string = range && range.startDate ? `${range.startDate}` : `0`
    let endDate: string = range && range.endDate ? `${range.endDate}` : `${getDateInYahooFinanceTime()}`
    let interval: string = range && range.interval ? `${range.interval}` : '1'
    
    return `https://query1.finance.yahoo.com/v7/finance/download/${ticker}?period1=${startDate}&period2=${endDate}&interval=${interval}d&events=history`
}

export const getTickerData = async (ticker: string): Promise<Object> => {
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
}
