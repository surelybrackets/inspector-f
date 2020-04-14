import express = require('express')
import { getForwardMovementStats } from './routes'

const app = express()
const PORT = 8080
const statisticsPath = '/statistics'

app.get(`${statisticsPath}/:ticker`, async (req, res) => {
    try {
        res.send(await getForwardMovementStats(req.params.ticker, undefined, req.query.dateRange as string))
    } catch (err) {
        // console.error(err)
        res.send(err.message)
    }
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`)
})
