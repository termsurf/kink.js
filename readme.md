<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<h3 align='center'>@nerdbond/kink</h3>
<p align='center'>
  Standard Error Creation in TypeScript
</p>

<br/>
<br/>
<br/>

## Installation

```
pnpm add @nerdbond/kink
yarn add @nerdbond/kink
npm i @nerdbond/kink
```

## Example

```ts
import Kink from '@nerdbond/kink'

const host = '@nerdbond/kink'

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

## NerdBond

This is being developed by the folks at [NerdBond](https://nerd.bond), a
California-based project for helping humanity master information and
computation. Find us on [Twitter](https://twitter.com/nerdbond),
[LinkedIn](https://www.linkedin.com/company/nerdbond), and
[Facebook](https://www.facebook.com/nerdbond). Check out our other
[GitHub projects](https://github.com/nerdbond) as well!
