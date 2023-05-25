# halt

```
yarn add @tunebond/halt
```

## Example

### Configure the Errors

Say we put these in `./errors`:

```ts
import Halt, { Link } from '@tunebond/halt'

import { convertIntegerToId } from '../utils/id'
import { permute8 } from '../utils/prng'

type WithName = {
  name: string
}

type WithType = WithName & {
  type: string
}

const base = {
  invalid_form: {
    code: 3,
    note: ({ name }: WithName) => `Form '${name}' is not valid`,
  },
  invalid_type: {
    code: 2,
    note: ({ name, type }: WithType) =>
      `Value '${name}' is not '${type}' type`,
  },
  missing_property: {
    code: 1,
    note: ({ name }: WithName) => `Property '${name}' missing`,
  },
}

type Base = typeof base

type Name = keyof Base

const code = (code: number) =>
  convertIntegerToId(permute8(code)).padStart(4, 'M')

export default function halt(form: Name, link: Link<Base, Name>) {
  return new Halt({ base, form, link, code })
}
```

### Throw the Errors

Now somewhere else in the code:

```ts
import { halt } from './errors'

try {
  throw halt('invalid_type', { name: 'foo', type: 'array' })
} catch (e) {
  console.log(e.toJSON()) // perfect for REST APIs
}
```
