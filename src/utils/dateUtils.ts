import * as moment from 'moment';

export const getDateInYahooFinanceTime = (date: moment.Moment = moment.utc()): number => {
    /* y = 86400x */
    const slope: number = 86400
    /* x (Apr 3, 2020) = 18355 */
    const base: number = 18355
    const apr3rd2020: moment.Moment = moment.utc("2020_04_03", "YYYY_MM_DD")

    const daydSinceApr3: number = date.diff(apr3rd2020, 'days')

    return slope * (base + daydSinceApr3)
}

export const validateDateString = (dateString: string): boolean => {
    const acceptedCharacters = ['_', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    for (let i = 0; i < dateString.length; i++) {
        if (!acceptedCharacters.includes(dateString[i])) return false
        if (i !== 4 && i !== 7) {
            if (dateString[i] === '_') return false
        } else {
            if (dateString[i] !== '_') return false
        }
    }
    return true
}

export const validateRange = (range: string): boolean => {
    if (range.includes('-')) {
        const splitRange = range.split('-')
        if (splitRange.length !== 2) {
            return false
        }
        const [startDate, endDate] = splitRange
        return validateDateString(startDate) && validateDateString(endDate)
    } else {
        return validateDateString(range)
    }
}

export const validateDateRanges = (dateRanges: string): boolean => {
    const ranges = dateRanges.split(',')

    for (let range of ranges) {
        if (!validateRange(range)) return false
    }
    return true
}

export const getLatestDateInRange = (dateRange: string): moment.Moment => {
    const ranges: string[] = dateRange.split(',')
    let lastestDate = moment.utc("1800_01_01", "YYYY_MM_DD")
    ranges.forEach((range: string) => {
        let dateToCompare: moment.Moment
        if (range.includes('-')) {
            range = range.split('-')[1]
        }
        dateToCompare = moment.utc(range, "YYYY_MM_DD")
        lastestDate = dateToCompare.diff(lastestDate) > 0 ? dateToCompare : lastestDate
    })
    return lastestDate
}
