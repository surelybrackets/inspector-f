import express = require('express')
import TickerData from '../../../../parsers/TickerData'
import * as swaggerUI from 'swagger-ui-express'
import docs from './swagger'

const route = express()
const routePath = ''

route.use(`/api-docs${routePath}`, swaggerUI.serve, swaggerUI.setup(docs))

route.get(`${routePath}/:ticker`, async (req, res) => {
    try {
        const tickerData = new TickerData(req.params.ticker)
        await tickerData.refreshData()
        res.send(tickerData.filterData(req.query.dateRange as string))
    } catch (err) {
        // console.error(err)
        res.send(err.message)
    }
})

module.exports.route = route
