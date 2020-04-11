import { getDateInYahooFinanceTime } from '../dateUtils'
import { utc } from 'moment'

describe('#getDateinYahooFinanceTime', (): void => {
    const yahooTimeSlope = 86400
    const apr3rdInYahooTime: number = yahooTimeSlope * 18355
    it('returns today in yahoo finance time', (): void => {
        const todayInYahooTime: number = getDateInYahooFinanceTime()
        const daysSinceApr3: number = utc().diff(utc('2020_04_03', 'YYYY_MM_DD'), 'days')
        const diffTodayApr3: number = todayInYahooTime - apr3rdInYahooTime
        expect(diffTodayApr3 / yahooTimeSlope).toBe(daysSinceApr3)
    })
})
