import Lru from 'lru-cache'

const memoryStore = (args = {}) => {
  const self = {
    name: 'memory'
  }
  const {
    ttl,
    max = 500,
    dispose,
    lenght,
    stale
  } = args
  const lruOpts = {
    max,
    maxAge: (ttl || ttl === 0) ? ttl * 1000 : null,
    dispose,
    lenght,
    stale
  }

  const lruCache = new Lru(lruOpts)

  self.set = (key, value, options = {}, cb) => {
    if (typeof options === 'function') {
      cb = options
      options = {}
    }

    const { ttl } = options
    const maxAge = (ttl || ttl === 0) ? ttl * 1000 : lruOpts.maxAge
    lruCache.set(key, value, maxAge)
    if (cb) {
      cb()
    } else {
      return Promise.resolve(value)
    }
  }

  self.get = (key, options, cb) => {
    if (typeof options === 'function') {
      cb = options
    }
    var value = lruCache.get(key)

    if (cb) {
      cb(null, value)
    } else {
      return value
    }
  }

  self.del = (key, options, cb) => {
    if (typeof options === 'function') {
      cb = options
    }
    lruCache.del(key)
    if (cb) {
      cb()
    }
  }

  self.reset = (cb) => {
    lruCache.reset()
    if (cb) {
      cb()
    }
  }

  self.keys = (cb) => {
    const keys = lruCache.keys()
    if (cb) {
      cb(null, keys)
    } else {
      return keys
    }
  }
  return self
}

const methods = {
  create: (args) => (memoryStore(args))
}

export default methods