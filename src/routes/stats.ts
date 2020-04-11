import { getTickerData } from '../utils/getTickerData'

export const getForwardMovementStats = (
    ticker: string,
    daysForward = 5,
    dateRange?: string,
): Promise<JSON[] | JSON | string> => {
    return getTickerData(ticker, dateRange)
}
