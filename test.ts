import halt, { assertHalt } from './index.js'

try {
  halt('one')
} catch (e) {
  assertHalt(e)
  console.log(e.toJSON())
  halt('two', { size: 2 })
}
