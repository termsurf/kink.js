/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomError } from 'ts-custom-error'

export type Base = {
  [key: string]: Form
}

export type Bind = Record<string, unknown>

// type Make = {
//   base: Base
//   code?: (code: number) => string
//   form: string
//   link: Bind
//   text?: (code: string, note: string) => string
// }
export type Form = {
  code: number
  hint?: (link: Bind) => string
  note: (link: Bind) => string
}

export class Halt<B, N extends keyof B & string> extends CustomError {
  form: string

  code: string

  constructor({
    base,
    form,
    link = {},
    code = makeCode,
    text = makeText,
  }: Make<B, N>) {
    const hook = base[form] as Form

    const { note } = hook
    const makeNote = note as unknown as UnionToIntersection<typeof note>
    const n = makeNote(link)

    const c = code(hook.code)
    const t = text(c, n)

    super(t)

    Object.defineProperty(this, 'form', {
      enumerable: false,
      value: form,
    })

    Object.defineProperty(this, 'code', {
      enumerable: false,
      value: c,
    })

    Object.defineProperty(this, 'name', {
      enumerable: false,
      value: 'Halt',
    })

    this.form = form
    this.code = c
  }

  toJSON() {
    return { code: this.code, form: this.form, text: this.message }
  }
}

export type Link<B, N extends keyof B & string> = Parameters<
  B[N] extends { note: (link: any) => string }
    ? B[N]['note'] extends (...args: any) => any
      ? B[N]['note']
      : never
    : never
>[0]

export type Make<B, N extends keyof B & string> = {
  base: B
  code?: (code: number) => string
  form: N
  link: Link<B, N>
  text?: (code: string, note: string) => string
}

type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never

export const makeCode = (code: number) =>
  code.toString(16).padStart(4, '0').toUpperCase()

export default function makeHalt<B, N extends keyof B & string>({
  base,
  form,
  link,
  code,
  text,
}: Make<B, N>) {
  return new Halt({ base, code, form, link, text })
}

export const makeText = (code: string, note: string) =>
  `[${code}] ${note}`
