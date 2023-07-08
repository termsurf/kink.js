
import Kink from './index.js'

const host = '@tunebond/kink'

type Base = {
  syntax_error: {}
}

type Name = keyof Base

Kink.base(host, 'syntax_error', () => ({
  code: 1,
  note: 'Syntax error'
}))

Kink.code(host, (code: number) => code.toString(16).padStart(4, '0'))

export default function kink<N extends Name>(form: N, link?: Base[N]) {
  return new Kink(Kink.makeBase(host, form, link))
}
