import { getTickerData } from '../utils/getTickerData'

export const allStats = (ticker: string): any => {
    return getTickerData(ticker)
}
