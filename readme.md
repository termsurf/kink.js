# Halt.js

```
yarn add @lancejpollard/halt.js
```

## Example

#### Configure the Errors

Say we put these in `./errors`:

```ts
import { Halt } from '@lancejpollard/halt.js'

import { convertIntegerToId } from '../utils/id'
import { permute8 } from '../utils/prng'

const host = 'tree.surf'

type Link = Record<string, unknown>

const HALT = {
  invalid_form: {
    code: 3,
    host,
    note: ({ name }: Link) => `Form '${name}' is not valid`,
  },
  invalid_type: {
    code: 2,
    host,
    note: ({ name, type }: Link) =>
      `Value '${name}' is not '${type}' type`,
  },
  missing_property: {
    code: 1,
    host,
    note: ({ name }: Link) => `Property '${name}' missing`,
  },
}

export { Halt }

export type HaltType = typeof HALT

Halt.list = HALT
Halt.code = (code: number) =>
  convertIntegerToId(permute8(code)).padStart(4, 'M')
```

#### Override type

In a file such as `./overrides.d.ts`

```
import { HaltType } from './errors'

declare module '@lancejpollard/halt.js' {
  export interface HaltList extends HaltType {}
}
```

#### Throw the Errors

Now somewhere else in the code:

```ts
import { Halt } from '@lancejpollard/halt.js'

try {
  throw new Halt('one')
} catch (e) {
  console.log(e.toJSON()) // perfect for REST APIs
  throw new Halt('two', { size: 2 })
}
```
