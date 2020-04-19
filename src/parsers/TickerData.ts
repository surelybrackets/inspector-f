import { utc, Moment } from 'moment'
import {
    getSavedDataFileName,
    saveHistoricalTickerData,
    getDataFromFile,
    extractDateFromDataFilename,
} from '../utils/saveData'
import { fetchTickerData } from '../utils/fetchData'
import { validateDateRanges, isDateInDateRange, dateFormat } from '../utils/dateUtils'

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
            this._data = getDataFromFile(dataFile)
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
            const freshData: TickerInfo[] = await fetchTickerData(this._ticker, {
                startDate: this._lastPull,
                endDate: this._initializeDate,
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
