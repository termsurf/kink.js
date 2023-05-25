/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomError } from 'ts-custom-error'

export type Base = {
  [key: string]: Form
}

export type Bind = Record<string, unknown>

export type Form = {
  code: number
  hint?: (link: Bind) => string
  note: (link: Bind) => string
}

export default class Halt<
  B,
  N extends keyof B & string,
> extends CustomError {
  form: string

  host: string

  code: string

  note: string

  constructor({
    base,
    host,
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
    const t = text(host, c, n)

    super(t)

    Object.defineProperty(this, 'host', {
      enumerable: false,
      value: host,
    })

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

    this.host = host
    this.form = form
    this.code = c
    this.note = n
  }

  toJSON() {
    return {
      code: this.code,
      form: this.form,
      host: this.host,
      note: this.note,
    }
  }
}

export type Link<B, N extends keyof B & string> = Parameters<
  B[N] extends { note: (link: any) => string } ? B[N]['note'] : never
>[0]

export type Make<B, N extends keyof B & string> = {
  base: B
  code?: (code: number) => string
  form: N
  host: string
  link: Link<B, N>
  text?: (host: string, code: string, note: string) => string
}

type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never

export const makeCode = (code: number) =>
  code.toString(16).padStart(4, '0').toUpperCase()

export const makeText = (host: string, code: string, note: string) =>
  `${host} [${code}] ${note}`
