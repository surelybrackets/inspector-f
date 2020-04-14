import express = require('express')
import { getTickerData } from '../../utils/tickerDataUtils'

const app = express()
const basePath = '/ticker-data'

app.get(`/:ticker`, async (req, res) => {
    try {
        res.send(await getTickerData(req.params.ticker, req.query.dateRange as string))
    } catch (err) {
        // console.error(err)
        res.send(err.message)
    }
})

module.exports.app = app
module.exports.basePath = basePath
