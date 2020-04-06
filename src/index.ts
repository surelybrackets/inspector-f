import express = require('express')
const app = express()
const PORT = 8080
const statisticsPath = '/statistics'

app.get(`${statisticsPath}/:ticker`, (req, res) => {
    return res.send(req.params);
});
app.listen(PORT, () =>
    console.log(`Example app listening on port ${PORT}!`),
);