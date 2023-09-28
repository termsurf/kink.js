import kink from './example.js'

try {
  throw kink('syntax_error')
} catch (e) {
  console.log(e)
}

console.log('done')
