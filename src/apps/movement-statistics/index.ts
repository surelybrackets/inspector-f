import express = require('express')
import TickerData from '../../parsers/TickerData'
import { mean, median, mode, counts, min, max, std } from '../../utils/statistics'
import { dataRoute } from '../../utils/saveData'

const app = express()
const basePath = '/movement-statistics'

interface MovementTracker {
    mean: number
    median: number
    mode: string[]
    max: number
    min: number
    std: number
    counts: { [key: string]: number }
}

app.get(`/:ticker`, async (req, res) => {
    try {
        const tickerData = new TickerData(req.params.ticker)
        await tickerData.refreshData()
        const indexes: number[] = tickerData.filterIndexes(req.query.dateRange as string)
        const interval: number = req.query.interval ? parseInt(req.query.interval as string) : 1
        const percMoves: number[] = []
        for (const i of indexes) {
            if (i + interval < tickerData.data.length) {
                const start: TickerInfo = tickerData.data[i]
                const end: TickerInfo = tickerData.data[i + interval]
                const priceChange: number = parseFloat(end.Close) - parseFloat(start.Close)
                percMoves.push((priceChange / parseFloat(start.Close)) * 100)
            }
        }
        const statistics: MovementTracker = {
            mean: mean(percMoves),
            median: median(percMoves),
            mode: mode(percMoves),
            max: max(percMoves),
            min: min(percMoves),
            std: std(percMoves),
            counts: counts(percMoves),
        }
        res.send(statistics)
    } catch (err) {
        // console.error(err)
        res.send(err.message)
    }
})

module.exports.app = app
module.exports.basePath = basePath
