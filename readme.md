# halt

```
yarn add @tunebond/halt
```

## Notes

You specify errors with a `code` which is an integer. The default
integer stringifier is like this:

```ts
export const code = (code: number) =>
  code.toString(16).padStart(4, '0').toUpperCase()
```

So it will print `000F` for code number 16, etc.

You can also format the text:

```ts
export const text = (host: string, code: string, note: string) =>
  `${host} [${code}] ${note}`
```

So an error message might be like (this is defined for the
`@tunebond/halt` namespace, but you would have your own namespace):

```
Halt: @tunebond/halt [0003] Form 'string' is not valid
... stack trace
```

Finally, you define the `halt` function which you use in your library or
app, and export it out:

```ts
import Halt, { Link } from '@tunebond/halt'

// this is an optionally defined function
export const code = (code: number) =>
  code.toString(16).padStart(4, '0').toUpperCase()

// this is an optionally defined function
export const text = (host: string, code: string, note: string) =>
  `${host} [${code}] ${note}`

export default function halt(form: Name, link: Link<Base, Name>) {
  return new Halt({ base, form, link, code, text })
}
```

A full example is next.

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

// you don't have to override this, but you can if you want.
// it defaults to:
// `code.toString(16).padStart(4, '0').toUpperCase()`
// which means it assumes less than 16^4 = 65536
// 65k errors per namespace, which is plenty.
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
