import { logError } from '../errorUtils'

describe('logError(e: any): void', (): void => {
    beforeEach((): void => {
        console.error = jest.fn()
    })
    it('logs error if error provided', (): void => {
        const err = 'test'
        logError(err)
        expect(console.error).toBeCalledWith(err)
    })
    it('logs nothing if no error provided', (): void => {
        logError()
        expect(console.error).not.toHaveBeenCalled()
    })
})
