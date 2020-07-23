import express = require('express')
import * as routes from './routes'

const app = express()
const appPath = '/inspectors'

Object.keys(routes).forEach((rt): void => {
    const { route } = routes[rt]
    app.use(appPath, route)
})

module.exports.app = app
