import CallbackFiller from './callback_filler'

/**
 * @param {object} args
 * @param {object|string} args.store - The store must at least have `set` and a `get` functions.
 * @param {boolean} [args.ignoreCacheErrors] Whether the cache error is ignored. False by default.
 * @param {function} [args.isCacheableValue]
 */
const Creator = (args = {}) => {
  const self = {}
  const storeName = args.store || 'memory'
  self.store = require(`./stores/${storeName}.js`).default.create(args)
  self.ignoreCacheErrors = args.ignoreCacheErrors || false
  const callbackFiller = new CallbackFiller()

  if (typeof args.isCacheableValue === 'function') {
    self._isCacheableValue = args.isCacheableValue
  } else if (typeof self.store.isCacheableValue === 'function') {
    self._isCacheableValue = self.store.isCacheableValue
  } else {
    self._isCacheableValue = (value) => {
      return value !== undefined
    }
  }

  /**
   * @function
   * @name wrap
   *
   * @param {string} key - The cache key to use in cache operations
   * @param {function} work - The function to wrap
   * @param {object} [options] - options passed to `set` function
   * @param {function} cb - callback function
   *
   * @example
   *   var key = 'user_' + userId;
   *   cache.wrap(key, function(cb) {
   *       User.get(userId, cb);
   *   }, function(err, user) {
   *       console.log(user);
   *   });
   */

  self.wrap = (key, work, options, cb) => {
    if (typeof options === 'function') {
      cb = options
      options = {}
    }

    if (!cb) {
      return new Promise((resolve, reject) => {
        _wrap(key, work, options, (err, data) => {
          if (err) reject(err)
          resolve(data)
        })
      })
    } else {
      _wrap(key, work, options, cb)
    }
  }

  const _wrap = (key, work, options, cb) => {
    var hasKey = callbackFiller.has(key)
    callbackFiller.add(key, cb)
    if (hasKey) { return }

    self.store.get(key, options, async (err, result) => {
      if (err && (!self.ignoreCacheErrors)) {
        callbackFiller.fill(key, err)
      } else if (self._isCacheableValue(result)) {
        callbackFiller.fill(key, null, result)
      } else {
        try {
          const data = await work()
          if (!self._isCacheableValue(data)) {
            return cb()
          }
          self.store.set(key, options, data, (err) => {
            if (err && (!self.ignoreCacheErrors)) {
              callbackFiller.fill(key, err)
            } else {
              callbackFiller.fill(key, null, data)
            }
          })
        } catch (e) {
          callbackFiller.fill(key, e)
        }
      }
    })
  }
  return self
}

export default Creator
