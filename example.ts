import halt, { Halt, HaltHook, assertHalt } from './index.js'

const HALT: Record<string, HaltHook> = {
  one: {
    code: 1,
    host: 'example',
    note: 'First error',
  },
  two: {
    code: 2,
    host: 'example',
    note: ({ size }) => `There are ${size} things.`,
  },
}

Halt.list = HALT

try {
  halt('one')
} catch (e) {
  assertHalt(e)
  console.log(e.toJSON())
  halt('two', { size: 2 })
}
