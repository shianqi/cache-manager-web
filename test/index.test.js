import { expect } from 'chai'
import CreateCache from '../src'

const getDate = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({ success: false })
  }, 50)
})

describe('Cache.wrap', () => {
  describe('', () => {
    const Cache = CreateCache({store: 'memory', max: 100, ttl: 5 * 1000})
    const key = 'getDate'

    describe('Use Callback', () => {
      it('should return undefined', () => {
        const func = Cache.wrap('test', getDate, () => {})
        expect(func).to.equal(undefined)
      })
    })

    describe('Not use Callback', () => {
      it('should return a Promise', () => {
        const func = Cache.wrap('test', getDate)
        expect(func instanceof Promise).to.equal(true)
      })
    })

    describe('Initial request data', () => {
      it('should more than 50 ms to return data', async () => {
        const start = new Date().valueOf()
        const data = await Cache.wrap(key, getDate)
        const end = new Date().valueOf()
        const time = end - start
        expect(data.success).to.equal(false)
        expect(time).to.be.above(50)
      })
    })

    describe('Request data again', () => {
      it('should less than 50 ms to return data', async () => {
        const start = new Date().valueOf()
        const data = await Cache.wrap(key, getDate)
        const end = new Date().valueOf()
        const time = end - start
        expect(data.success).to.equal(false)
        expect(time).to.be.below(50)
      })
    })
  })

  describe('Use isCacheableValue option', () => {
    const Cache = CreateCache({
      store: 'memory',
      max: 100,
      ttl: 5 * 1000,
      isCacheableValue: (value) => { return value && value.success === true }
    })
    const key = 'test_isCacheableValue'

    describe('Initial request data', () => {
      it('should more than 50 ms to return data', async () => {
        const start = new Date().valueOf()
        const data = await Cache.wrap(key, getDate)
        const end = new Date().valueOf()
        const time = end - start
        expect(data.success).to.equal(false)
        expect(time).to.be.above(50)
      })
    })

    describe('Request data again', () => {
      it('should less than 50 ms to return data', async () => {
        const start = new Date().valueOf()
        const data = await Cache.wrap(key, getDate)
        const end = new Date().valueOf()
        const time = end - start
        expect(data.success).to.equal(false)
        expect(time).to.be.above(50)
      })
    })
  })
})
