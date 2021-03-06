import express = require('express')
// import TickerData from '@surelybrackets/inspector-f-parsers/TickerData'
// import {} from '@surelybrackets/inspector-f-utils/...'
// import { TickerInfo } from '@surelybrackets/inspector-f_types'
import * as swaggerUI from 'swagger-ui-express'
import docs from './swagger'

const route = express()
const routePath = '/comparison'

route.use(`/api-docs${routePath}`, swaggerUI.serve, swaggerUI.setup(docs))

route.get(`${routePath}/:var`, async (req, res) => {
    res.send({ 404: 'App is under construction' })
})

module.exports.route = route
