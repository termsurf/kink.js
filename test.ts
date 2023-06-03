import halt from './example.js'

try {
  throw halt('invalid_form', { name: 'string' })
} catch (e) {
  console.log(e)
}
