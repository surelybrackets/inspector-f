import express = require('express')
import { allStats } from './routes'

const app = express()
const PORT = 8080
const statisticsPath = '/statistics'

app.get(`${statisticsPath}/:ticker`, async (req, res) => {
    return res.send(await allStats(req.params.ticker));
});
app.listen(PORT, () =>
    console.log(`Example app listening on port ${PORT}!`),
);
