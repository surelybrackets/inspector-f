const fs = require('fs')

export const saveHistoricalTickerData = async (ticker: string, data: JSON) => {
    const today = new Date()
    const todayString = `${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`

    await fs.writeFile(`data/${ticker}${todayString}.json`, JSON.stringify(data), (err) => {
        if (err) console.error(err)
    })
}

export const getSavedDataList = (): string[] => {
    return fs.readdirSync('data');
}

export const isTickerDataSaved = (ticker: string): string | undefined => {
    const dataFiles: string[] = getSavedDataList()
    return dataFiles.find((file: string): boolean => file.includes(ticker))
}

export const extractDateFromDataFilename = (dataFile: string, ticker: string): Date => {
    const fileWriteDateString: string = dataFile.slice(ticker.length, dataFile.length - 5)
    const fileWriteDateArray: number[] = fileWriteDateString.split('_').map((item: string): number => parseInt(item))
    return new Date(fileWriteDateArray[0], fileWriteDateArray[1], fileWriteDateArray[2])
}