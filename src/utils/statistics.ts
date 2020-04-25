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

export const mode = (counts: { [key: string]: number }): string[] => {
    const modes: string[] = []

    return modes
}
