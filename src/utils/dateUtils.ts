import { utc, Moment } from 'moment'

export const dateFormat = 'YYYY_MM_DD'

/**
 * Validates that the provided date string matches format YYYY_MM_DD.
 * @param dateString A date in the format YYYY_MM_DD
 */
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

/**
 * Validates a range of date is a single date string or a range in the format YYYY_MM_DD.
 * @param range A date range in the format YYYY_MM_DD-YYYY_MM_DD or single date YYYY_MM_DD
 */
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

/**
 * Validates that each item in a date range list is a valid date range.
 * @param dateRanges A list of date ranges as a string
 */
export const validateDateRanges = (dateRanges: string): boolean => {
    const ranges = dateRanges.split(',')

    for (const range of ranges) {
        if (!validateRange(range)) return false
    }
    return true
}

/**
 * Gets the latest date that occurs in a date range list.
 * @param dateRange A list of date ranges as a string
 */
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

/**
 * Determines if 'date' exists inside of 'dateRange'.
 * @param date A date
 * @param dateRange A list of date ranges
 */
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
