export const getDateInYahooFinanceTime = (date: Date = new Date()): number => {
    /* y = 86400x */
    const slope: number = 86400
    /* x (Apr 3, 2020) = 18355 */
    const base: number = 18355
    const apr3rd2020: Date = new Date(2020, 4, 3)

    const daydSinceApr3: number = date.getDate() - apr3rd2020.getDate();

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

export const getLatestDateInRange = (dateRange: string): Date => {
    const ranges: string[] = dateRange.split(',')
    let lastestDate = new Date(1800, 1, 1)
    ranges.forEach((range: string) => {
        let dateArray: number[]
        let dateToCompare: Date
        if (range.includes('-')) {
            range = range.split('-')[1]
        }
        dateArray = range.split('_').map((item: string) => parseInt(item))
        dateToCompare = new Date(dateArray[0], dateArray[1], dateArray[2])
        lastestDate = (dateToCompare >= lastestDate) ? dateToCompare : lastestDate
    })
    return lastestDate
}

export const normalizeDate = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}
