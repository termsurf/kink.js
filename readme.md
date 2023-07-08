<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<h3 align='center'>@tunebond/kink</h3>
<p align='center'>
  Standard Error Creation in TypeScript
</p>

<br/>
<br/>
<br/>

## Installation

```
pnpm add @tunebond/kink
yarn add @tunebond/kink
npm i @tunebond/kink
```

## Example

```ts
import Kink from '@tunebond/kink'

const host = '@tunebond/kink'

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

## TuneBond

This is being developed by the folks at [TuneBond](https://tune.bond), a
California-based project for helping humanity master information and
computation. Find us on[Twitter](https://twitter.com/tunebond),
[LinkedIn](https://www.linkedin.com/company/tunebond), and
[Facebook](https://www.facebook.com/tunebond). Check out our other
[GitHub projects](https://github.com/tunebond) as well!
