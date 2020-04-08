const fs = require('fs')

export const saveHistoricalTickerData = async (ticker: string, data: JSON) => {
    const today = new Date()
    const todayString = `${today.getFullYear()}-${today.getDate()}-${today.getDay()}`

    await fs.writeFile(`data/${ticker}${todayString}.json`, JSON.stringify(data), (err) => {
        console.error(err)
    })
}
