# Halt.js

```
yarn add @tunebond/halt.js
```

## Example

#### Configure the Errors

Say we put these in `./errors`:

```ts
import { Base, Halt, Link } from '@tunebond/halt.js'

import { convertIntegerToId } from '../utils/id'
import { permute8 } from '../utils/prng'

const base: Base = {
  invalid_form: {
    code: 3,
    note: ({ name }) => `Form '${name}' is not valid`,
  },
  invalid_type: {
    code: 2,
    note: ({ name, type }) => `Value '${name}' is not '${type}' type`,
  },
  missing_property: {
    code: 1,
    note: ({ name }) => `Property '${name}' missing`,
  },
}

type Name = keyof typeof base

const formCode = (code: number) =>
  convertIntegerToId(permute8(code)).padStart(4, 'M')

export const halt = (name: Name, link: Link<Name>) =>
  new Halt(base, name, link, formCode)
```

#### Throw the Errors

Now somewhere else in the code:

```ts
import { halt } from './errors'

try {
  throw halt('invalid_type', { name: 'foo', type: 'array' })
} catch (e) {
  console.log(e.toJSON()) // perfect for REST APIs
}
```
