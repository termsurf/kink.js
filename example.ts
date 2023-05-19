import halt, { Halt, HaltList, assertHalt } from './index.js'

const HALT: HaltList = {
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

export { Halt, assertHalt, halt }

Halt.list = HALT

export type HaltType = typeof HALT
