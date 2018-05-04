# Cache-Manager-Web

[![Build Status](https://www.travis-ci.org/shianqi/cache-manager-web.svg?branch=master)](https://www.travis-ci.org/shianqi/cache-manager-web)
[![Coverage Status](https://coveralls.io/repos/github/shianqi/cache-manager-web/badge.svg?branch=master)](https://coveralls.io/github/shianqi/cache-manager-web?branch=master)

## Installation

```bash
npm install --save cache-manager-web
```

## Usage

```javascript
import CreateCache from 'cache-manager-web'

const Cache = CreateCache({
  store: 'memory',
  max: 100,
  ttl: 5 * 1000
})

const getMockDate = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({ success: true })
  }, 500)
})

const init = async () => {
  const key = 'test'
  const data = await Cache.wrap(key, getMockDate)
}

init()
```

## React.js Example

See the [Cache-Manager-Web-Example](https://github.com/shianqi/cache-manager-web-example) to see use `chche-manage-web` in your applications.

## API

## Features

* Improve README.md documentation
* 100% test coverage via mocha, nyc

## License

cache-manager-web is licensed under the MIT license.
