import Creator from '../src/index'

const Cache = Creator({store: 'memory', max: 100, ttl: 10})

const cacheKey = `User_${233}`
Cache.wrap(cacheKey, async () => {
  await fetch('http://blog.seniverse.com/wp-json/wp/v2/posts?per_page=6&context=embed')
    .then(response => response.json())
    .then(json => json)
}, (err, data) => {
  if (err) {
    console.log(err)
  } else {
    console.log(data)
  }
})
