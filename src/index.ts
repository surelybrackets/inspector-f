import express = require('express')
import * as apps from './apps'

const api = express()
const PORT = 8080

Object.keys(apps).forEach((appName) => {
    console.log(appName)
    const { app } = apps[appName]
    api.use(app)
})

api.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`)
})
