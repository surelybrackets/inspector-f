import { utc, Moment } from 'moment'

export const getDateInYahooFinanceTime = (date: Moment = utc()): number => {
    /* y = 86400x */
    const slope = 86400
    /* x (Apr 3, 2020) = 18355 */
    const base = 18355
    const apr3rd2020: Moment = utc('2020_04_03', 'YYYY_MM_DD')

    const daydSinceApr3: number = date.diff(apr3rd2020, 'days')

    return slope * (base + daydSinceApr3)
}

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
