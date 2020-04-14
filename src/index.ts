import express = require('express')
import * as apps from './apps'

const router = express()
const PORT = 8080

Object.keys(apps).forEach((appName) => {
    const { app, basePath } = apps[appName]
    router.use(basePath, app)
})

router.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`)
})
