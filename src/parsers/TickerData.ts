import { utc, Moment } from 'moment'
import {
    getSavedDataFileName,
    saveHistoricalTickerData,
    getDataFromFile,
    extractDateFromDataFilename,
} from '@surelybrackets/inspector-f-utils/saveData'
import { fetchTickerData } from '@surelybrackets/inspector-f-utils/fetchData'
import { validateDateRanges, isDateInDateRange, dateFormat } from '@surelybrackets/inspector-f-utils/dateUtils'
import { TickerInfo } from '@surelybrackets/inspector-f_types'

export default class TickerData {
    private _data: TickerInfo[]
    private _lastPull: Moment | undefined
    private _ticker: string
    private _initializeDate: Moment

    static dateFormat: 'YYYY_MM_DD'

    constructor(ticker: string) {
        this._ticker = ticker
        this._initializeDate = utc()

        const dataFile: string = getSavedDataFileName(ticker)

        if (dataFile) {
            this._data = getDataFromFile<TickerInfo>(dataFile)
            this._lastPull = extractDateFromDataFilename(dataFile)
        } else {
            this._data = []
        }
    }

    /* getters */

    public get data(): TickerInfo[] {
        return this._data
    }

    public get lastPull(): Moment | undefined {
        return this._lastPull
    }

    public get ticker(): string {
        return this._ticker
    }

    public get initializeDate(): Moment {
        return this._initializeDate
    }

    /* methods */

    public isSynced(): boolean {
        return !!this._lastPull && this._initializeDate.diff(this._lastPull, 'days') === 0
    }

    public async refreshData(): Promise<TickerInfo[]> {
        if (!this.isSynced()) {
            try {
                const freshData: TickerInfo[] = await fetchTickerData(this._ticker, {
                    startDate: this._lastPull,
                    endDate: this._initializeDate,
                })
                this._data = this._data.concat(freshData)
                saveHistoricalTickerData(this._ticker, this._data)
            } catch (e) {
                if (e.response && e.response.data !== '404 Not Found: Timestamp data missing.')
                    throw new Error('500 Internal Server error.')
            }
            this._lastPull = this._initializeDate
        }
        return this._data
    }

    public filterData(dateRange?: string): TickerInfo[] {
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

    public filterIndexes(dateRange?: string): number[] {
        if (dateRange) {
            if (validateDateRanges(dateRange)) {
                return this._data.reduce((acc: number[], day: TickerInfo, index: number): number[] => {
                    if (isDateInDateRange(utc(day.Date, dateFormat), dateRange)) acc.push(index)
                    return acc
                }, [])
            } else {
                throw new Error('Invalid dateString.')
            }
        } else {
            return [...Array<number>(this._data.length).keys()]
        }
    }
}
