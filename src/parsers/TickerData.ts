import { utc, Moment } from 'moment'
import axios from 'axios'
import csv = require('csvtojson')
import {
    getSavedDataFileName,
    saveHistoricalTickerData,
    getDataFromFile,
    extractDateFromDataFilename,
} from '../utils/saveData'
import { generateYahooDataLink } from '../utils/fetchData'
import { getDateInYahooFinanceTime, validateDateRanges, isDateInDateRange, dateFormat } from '../utils/dateUtils'
import { logError } from '../utils/errorUtils'

export default class TickerData {
    private _ticker: string
    private _data: TickerInfo[]
    private _initializeDate: Moment
    private _lastPull: Moment | undefined

    static dateFormat: 'YYYY_MM_DD'

    constructor(ticker: string) {
        this._ticker = ticker
        this._initializeDate = utc(utc(), TickerData.dateFormat)

        const dataFile: string = getSavedDataFileName(ticker)

        if (dataFile) {
            this._data = getDataFromFile(dataFile)
            this._lastPull = extractDateFromDataFilename(dataFile)
        } else {
            this._data = []
        }
    }

    public isSynced(): boolean {
        return this._lastPull && this._initializeDate.diff(this._lastPull, 'days') === 0
    }

    public async refreshData(): Promise<TickerInfo[]> {
        if (!this.isSynced()) {
            const startDate = this._lastPull
                ? getDateInYahooFinanceTime(this._lastPull)
                : getDateInYahooFinanceTime(utc('1800_01_01', TickerData.dateFormat))
            const endDate = getDateInYahooFinanceTime(this._initializeDate)
            const getString: string = generateYahooDataLink(this._ticker, { startDate, endDate })
            const freshData = await axios.get(getString, {}).then(async (res) => {
                return await csv().fromString(res.data).on('error', logError)
            })
            this._data = this._data.concat(freshData)
            this._lastPull = this._initializeDate
            saveHistoricalTickerData(this._ticker, this._data)
        }
        return this._data
    }

    public filter(dateRange?: string): TickerInfo[] {
        if (dateRange) {
            if (validateDateRanges(dateRange)) {
                return this._data.filter((day: TickerInfo): boolean => {
                    return isDateInDateRange(utc(day.Date, dateFormat), dateRange)
                })
            } else {
                throw new Error('Invalid dateString.')
            }
        } else {
            return this._data
        }
    }
}
