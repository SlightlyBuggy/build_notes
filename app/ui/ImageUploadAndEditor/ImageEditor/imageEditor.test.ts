import { describe, test, expect} from '@jest/globals'


const sum = (x: number, y: number) => {
    return x + y
}

describe('sum module', () => {
    test('adds 1 plus 2 to euqal 3', () => {
        const answer = sum(1,2)
        expect(answer).toEqual(3)
    })
})

