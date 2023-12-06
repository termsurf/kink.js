<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<h3 align='center'>@textsurf/kink</h3>
<p align='center'>
  Standard Error Creation in TypeScript
</p>

<br/>
<br/>
<br/>

## Installation

```
pnpm add @textsurf/kink
yarn add @textsurf/kink
npm i @textsurf/kink
```

## Example

```ts
import Kink from '@textsurf/kink'

const host = '@textsurf/kink'

type Base = {
  syntax_error: {}
}

type Name = keyof Base

Kink.base(host, 'syntax_error', () => ({
  code: 1,
  note: 'Syntax error',
}))

Kink.code(host, (code: number) => code.toString(16).padStart(4, '0'))

export default function kink<N extends Name>(form: N, link?: Base[N]) {
  return new Kink(Kink.makeBase(host, form, link))
}
```

```ts
import kink from './example.js'

try {
  throw kink('syntax_error')
} catch (e) {
  console.log(e)
}
```

## License

MIT

## TextSurf

This is being developed by the folks at [TextSurf](https://text.surf), a
California-based project for helping humanity master information and
computation. Find us on [Twitter](https://twitter.com/textsurf),
[LinkedIn](https://www.linkedin.com/company/textsurf), and
[Facebook](https://www.facebook.com/textsurf). Check out our other
[GitHub projects](https://github.com/textsurf) as well!
