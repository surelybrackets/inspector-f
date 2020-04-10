import { getTickerData } from '../utils/getTickerData'

export const getForwardMovementStats = (ticker: string, daysForward: number = 5, dateRange?: string): any => {
    return getTickerData(ticker, dateRange)
}
