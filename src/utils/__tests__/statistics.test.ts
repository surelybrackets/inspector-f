import { mean, median, min, max, counts, mode, std, sterr } from '../statistics'

const evenTestSet = [-5, -4, -3, -2, -2, -1, -0.5, 0, 0, 0.5, 1, 2, 2, 3, 4, 5]
const oddTestSet = [-5, -2, 2, 2, 3, -1, -0.5, 0, 0.5, 1, 4, 5, -4, -3, -2]

describe('mean(data: number[]): number', (): void => {
    it('returns the average of a set of numbers', () => {
        expect(mean(evenTestSet)).toBe(0)
    })
})

describe('median(data: number[]): number', (): void => {
    it('returns the median value from a even length set of numbers', (): void => {
        expect(median(evenTestSet)).toBe(0)
    })
    it('returns the median value from a odd length set of numbers', (): void => {
        expect(median(oddTestSet)).toBe(0)
    })
})

describe('min(data: number[]): number', (): void => {
    it('returns the minimum value from a set of numbers', (): void => {
        expect(min(evenTestSet)).toBe(-5)
    })
})

describe('max(data: number[]): number', (): void => {
    it('returns the maximum value from a set of numbers', (): void => {
        expect(max(evenTestSet)).toBe(5)
    })
})

describe('counts(data: number[]): { [key: string]: number }', (): void => {
    it('returns dictionary with count buckets in positive order', (): void => {
        const expectedResult = {
            '+5': 1,
            '+4': 1,
            '+3': 1,
            '+2': 2,
            '+1': 1,
            '+0': 3,
            '-1': 2,
            '-2': 2,
            '-3': 1,
            '-4': 1,
            '-5': 1,
        }
        expect(counts(evenTestSet)).toStrictEqual(expectedResult)
    })
})

describe('mode(data: number[], cnt?: { [key: string]: number }): string[]', (): void => {
    it('returns list of most frequently occuring buckets', (): void => {
        expect(mode(evenTestSet).sort()).toStrictEqual(['+0'].sort())
    })
    it('returns list of most frequently occuring buckets, using provided array', (): void => {
        const cnts = {
            '+0': 1,
            '-1': 2,
            '-2': 2,
            '-3': 1,
            '-4': 1,
            '-5': 1,
            '-6': 1,
            '-7': 1,
            '-8': 2,
            '-9': 1,
            '-10': 2,
        }
        // @ts-ignore
        counts = jest.fn(() => cnts)
        expect(mode(oddTestSet, cnts).sort()).toStrictEqual(['-1', '-2', '-8', '-10'].sort())
        expect(counts).not.toHaveBeenCalled()
    })
})

describe('std(data: number[], mu?: number): number', (): void => {
    it('returns standard deviation of set of numbers', (): void => {
        expect(std(evenTestSet)).toBe(2.8106938645110393)
    })
    it('returns standard deviation of set of numbers, with provided mean', (): void => {
        const mu = mean(evenTestSet)
        // @ts-ignore
        mean = jest.fn(() => mu)
        expect(std(evenTestSet, mu)).toBe(2.8106938645110393)
        expect(mean).not.toHaveBeenCalled()
    })
})

describe('sterr(data: number[], s?: number): number', (): void => {
    it('returns standard err of a set of numbers', (): void => {
        expect(sterr(evenTestSet)).toBe(0.7026734661277598)
    })
    it('returns standard deviation of set of numbers, with provided mean', (): void => {
        const s = std(evenTestSet)
        // @ts-ignore
        std = jest.fn(() => s)
        expect(sterr(evenTestSet, s)).toBe(0.7026734661277598)
        expect(std).not.toHaveBeenCalled()
    })
})
