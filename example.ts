import { Halt, HaltList } from './index.js'

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

export type HaltType = typeof HALT

Halt.list = HALT
