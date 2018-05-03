import { expect } from 'chai'
import CreateCache from '../src'

const Cache = CreateCache({store: 'memory', max: 100, ttl: 5})

const getDate = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({ success: true })
  }, 100)
})

describe('Cache.wrap', () => {
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
      expect(func).to.be.a('promise')
    })
  })

  describe('Initial request data', () => {
    it('should more than 100 ms to return data', async () => {
      const start = new Date().valueOf()
      const data = await Cache.wrap(key, getDate)
      const end = new Date().valueOf()
      const time = end - start
      expect(data.success).to.equal(true)
      expect(time).to.be.above(100)
    })
  })

  describe('Request data again', () => {
    it('should less than 100 ms to return data', async () => {
      const start = new Date().valueOf()
      const data = await Cache.wrap(key, getDate)
      const end = new Date().valueOf()
      const time = end - start
      expect(data.success).to.equal(true)
      expect(time).to.be.below(100)
    })
  })
})
