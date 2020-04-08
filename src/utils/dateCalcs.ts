export const getDateInYahooFinanceTime = (date: Date = new Date()): number => {
    /* y = 86400x */
    const slope: number = 86400
    /* x (Apr 3, 2020) = 18355 */
    const base: number = 18355
    const apr3rd2020: Date = new Date(2020, 4, 3)

    const daydSinceApr3: number = date.getDate() - apr3rd2020.getDate();

    return slope * (base + daydSinceApr3)
}
