export const mean = (data: number[]): number => {
    return data.reduce((prev: number, next: number): number => prev + next, 0) / data.length
}

export const median = (data: number[]): number => {
    data.sort((left: number, right: number): number => left - right)
    if (data.length % 2 === 1) {
        return data[Math.floor(data.length / 2)]
    } else {
        return (data[data.length / 2] + data[data.length / 2 - 1]) / 2
    }
}

export const min = (data: number[]): number => Math.min(...data)

export const max = (data: number[]): number => Math.max(...data)

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

export const std = (data: number[], mu?: number): number => {
    mu = mu ? mu : mean(data)

    const variance =
        data.reduce(function (sq, n) {
            return sq + Math.pow(n - mu, 2)
        }, 0) /
        (data.length - 1)
    return Math.sqrt(variance)
}
