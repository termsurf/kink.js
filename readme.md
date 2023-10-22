<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<h3 align='center'>@wavebond/kink</h3>
<p align='center'>
  Standard Error Creation in TypeScript
</p>

<br/>
<br/>
<br/>

## Installation

```
pnpm add @wavebond/kink
yarn add @wavebond/kink
npm i @wavebond/kink
```

## Example

```ts
import Kink from '@wavebond/kink'

const host = '@wavebond/kink'

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

## WaveBond

This is being developed by the folks at [WaveBond](https://wave.bond), a
California-based project for helping humanity master information and
computation. Find us on [Twitter](https://twitter.com/wavebond),
[LinkedIn](https://www.linkedin.com/company/wavebond), and
[Facebook](https://www.facebook.com/wavebond). Check out our other
[GitHub projects](https://github.com/wavebond) as well!
