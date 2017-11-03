class CallbackFiller {
  constructor () {
    this.queues = {}
  }
  fill (key, err, data) {
    const waiting = [...this.queues[key]]
    delete this.queues[key]

    waiting.forEach((cb) => {
      cb(err, data)
    })
  }
  has (key) {
    return this.queues[key]
  }
  add (key, funcObj) {
    if (this.queues[key]) {
      this.queues[key].push(funcObj)
    } else {
      this.queues[key] = [funcObj]
    }
  }
}

export default CallbackFiller
