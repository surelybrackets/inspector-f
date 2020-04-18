import { utc, Moment } from 'moment'

export const dateFormat = 'YYYY_MM_DD'

export const validateDateString = (dateString: string): boolean => {
    const acceptedCharacters = ['_', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    if (dateString.length !== 10) return false
    for (let i = 0; i < dateString.length; i++) {
        if (!acceptedCharacters.includes(dateString[i])) return false
        if (i !== 4 && i !== 7) {
            if (dateString[i] === '_') return false
        } else {
            if (dateString[i] !== '_') return false
        }
    }
    if (!utc(dateString, 'YYYY_MM_DD').isValid()) return false
    return true
}

export const validateRange = (range: string): boolean => {
    if (range.includes('-')) {
        const splitRange = range.split('-')
        if (splitRange.length !== 2) {
            return false
        }
        const [startDate, endDate] = splitRange
        if (validateDateString(startDate) && validateDateString(endDate))
            return utc(startDate, 'YYYY_MM_DD').diff(utc(endDate, 'YYYY_MM_DD')) < 0
        else return false
    } else {
        return validateDateString(range)
    }
}

export const validateDateRanges = (dateRanges: string): boolean => {
    const ranges = dateRanges.split(',')

    for (const range of ranges) {
        if (!validateRange(range)) return false
    }
    return true
}

export const getLatestDateInRange = (dateRange: string): Moment => {
    const ranges: string[] = dateRange.split(',')
    let lastestDate = utc('1800_01_01', 'YYYY_MM_DD')
    ranges.forEach((range: string) => {
        if (range.includes('-')) {
            range = range.split('-')[1]
        }
        const dateToCompare: Moment = utc(range, 'YYYY_MM_DD')
        lastestDate = dateToCompare.diff(lastestDate) > 0 ? dateToCompare : lastestDate
    })
    return lastestDate
}

export const isDateInDateRange = (date: Moment, dateRange: string): boolean => {
    for (const range of dateRange.split(',')) {
        if (range.includes('-')) {
            const [startDate, endDate] = range.split('-')
            if (utc(startDate, dateFormat).diff(date, 'days') <= 0 && utc(endDate, dateFormat).diff(date, 'days') >= 0)
                return true
        } else {
            const testDate: Moment = utc(range, dateFormat)
            if (testDate.diff(date, 'days') === 0) return true
        }
    }
    return false
}
