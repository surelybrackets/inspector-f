/**
 * Determines the average(mean) of a set of numbers.
 * @param data A set of numbers as an array
 */
export const mean = (data: number[]): number => {
    return data.reduce((prev: number, next: number): number => prev + next, 0) / data.length
}

/**
 * Determines the median of a set of numbers.
 * @param data A set of numbers as an array
 */
export const median = (data: number[]): number => {
    data.sort((left: number, right: number): number => left - right)
    if (data.length % 2 === 1) {
        return data[Math.floor(data.length / 2)]
    } else {
        return (data[data.length / 2] + data[data.length / 2 - 1]) / 2
    }
}

/**
 * Determines the minimum value of a set of numbers.
 * @param data A set numbers as an array
 */
export const min = (data: number[]): number => Math.min(...data)

/**
 * Determines the maximum value of a set of numbers.
 * @param data A set of numbers as an array
 */
export const max = (data: number[]): number => Math.max(...data)

/**
 * Counts the occurences of values in a set, placed in buckets of length b <= x < b + 1.
 * (ie. if x=4.5, it will be stored in bucket b=4)
 * @param data A set of numbers as an array
 */
export const counts = (data: number[]): { [key: string]: number } => {
    const counts: { [key: string]: number } = data.reduce((acc: { [key: string]: number }, datum: number): {
        [key: string]: number
    } => {
        const key: string = Math.floor(datum) >= 0 ? `+${Math.floor(datum)}` : `-${Math.abs(Math.floor(datum))}`
        acc[key] = acc[key] !== undefined ? acc[key] + 1 : 1
        return acc
    }, {})

    const orderedKeys = Object.keys(counts).sort((a: string, b: string): number => {
        const [aSign, aVal] = [a[0], a.substr(1)]
        const [bSign, bVal] = [b[0], b.substr(1)]
        const aTrueVal = aSign === '+' ? parseInt(aVal) : -1 * parseInt(aVal)
        const bTrueVal = bSign === '+' ? parseInt(bVal) : -1 * parseInt(bVal)
        if (aTrueVal > bTrueVal) return -1
        else if (aTrueVal < bTrueVal) return 1
        return 0
    })

    const sortedCounts: { [key: string]: number } = {}
    orderedKeys.forEach((key) => {
        sortedCounts[key] = counts[key]
    })

    return sortedCounts
}

/**
 * Returns an array of bucket keys, which include the most occurences. This function is
 * based off count objects, which are returned from counts().
 * @param data A set of numbers as an array
 * @param cnts An optional count object for use in calculation. This will skip internal
 * count calculation, which can improve effeciency if counts have been calculated elsewhere.
 */
export const mode = (data: number[], cnts?: { [key: string]: number }): string[] => {
    cnts = cnts ? cnts : counts(data)
    let modes: string[] = undefined

    for (const key of Object.keys(cnts)) {
        if (!modes) {
            modes = [key]
        } else {
            if (cnts[modes[0]] < cnts[key]) {
                modes = [key]
            } else if (cnts[modes[0]] === cnts[key]) {
                modes.push(key)
            }
        }
    }

    return modes
}

/**
 * Determines the standard deviation of a set of numbers.
 * @param data A set of numbers as an array
 * @param ma An optional avg(mean) parameter. Using this parameter will skip internal
 * mean caculations, potentially improving performance if mean was calculated elsewhere.
 */
export const std = (data: number[], mu?: number): number => {
    mu = mu ? mu : mean(data)

    const variance =
        data.reduce(function (sq, n) {
            return sq + Math.pow(n - mu, 2)
        }, 0) /
        (data.length - 1)
    return Math.sqrt(variance)
}
