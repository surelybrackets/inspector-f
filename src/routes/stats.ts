import { getTickerData } from '../utils/tickerDataUtils'

export const getForwardMovementStats = (
    ticker: string,
    daysForward = 5,
    dateRange?: string,
): Promise<TickerInfo[] | string> => {
    return getTickerData(ticker, dateRange)
}
