# Halt.js

```
yarn add @lancejpollard/halt.js
```

## Example

#### Configure the Errors

```ts
import { Halt, HaltHook, assertHalt } from '@lancejpollard/halt.js'

const HALT: Record<string, HaltHook> = {
  one: {
    code: 1,
    note: 'First error',
  },
  two: {
    code: 2,
    note: ({ size }) => `There are ${size} things.`,
  },
}

Halt.list = HALT
Halt.code = (code: number) =>
  code.toString(16).padStart(4, '0').toUpperCase()
```

#### Throw the Errors

```ts
import halt from '@lancejpollard/halt.js'

try {
  halt('one')
} catch (e) {
  console.log(e.toJSON()) // perfect for REST APIs
  halt('two', { size: 2 })
}
```
