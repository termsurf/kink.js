import { assertHalt, halt } from './example.js'

try {
  halt('one')
} catch (e) {
  assertHalt(e)
  console.log(e.toJSON())
  halt('two', { size: 2 })
}
