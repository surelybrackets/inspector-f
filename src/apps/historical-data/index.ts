import express = require('express')
import TickerData from '../../parsers/TickerData'

const app = express()
const basePath = '/historical-data'

app.get(`/:ticker`, async (req, res) => {
    try {
        const tickerData = new TickerData(req.params.ticker)
        await tickerData.refreshData()
        res.send(tickerData.filterData(req.query.dateRange as string))
    } catch (err) {
        // console.error(err)
        res.send(err.message)
    }
})

module.exports.app = app
module.exports.basePath = basePath
