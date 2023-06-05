/* eslint-disable @typescript-eslint/no-explicit-any */
import { HaltTone, makeText, saveLinkList } from 'text'
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
  N extends keyof B & string = keyof B & string,
> extends CustomError {
  form: string

  host: string

  code: string

  note: string

  link: Link<B, N>

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

    Object.defineProperty(this, 'link', {
      enumerable: false,
      value: link,
    })

    this.host = host
    this.form = form
    this.code = c
    this.note = n
    this.link = link
  }

  toJSON(): HaltMesh {
    return {
      code: this.code,
      form: this.form,
      host: this.host,
      link: this.link,
      note: this.note,
    }
  }
}

export type HaltMesh = {
  code: string
  form: string
  host: string
  link: Record<string, unknown>
  note: string
}

export type Link<
  B,
  N extends keyof B & string = keyof B & string,
> = Parameters<
  B[N] extends { note: (link: any) => string } ? B[N]['note'] : never
>[0]

export type Make<B, N extends keyof B & string = keyof B & string> = {
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

export function haveHalt<
  B,
  N extends keyof B & string = keyof B & string,
>(lead: unknown): asserts lead is Halt<B, N> {
  if (!testHalt<B, N>(lead)) {
    if (lead instanceof Error) {
      throw lead
    } else {
      throw new Error('Not halt')
    }
  }
}

export const makeCode = (code: number) =>
  code.toString(16).padStart(4, '0').toUpperCase()

export function makeHalt<
  B,
  N extends keyof B & string = keyof B & string,
>({
  base,
  host,
  form,
  link = {},
  code = makeCode,
  text = makeText,
  tone = 'fall',
}: Make<B, N> & { tone: HaltTone }): void {
  // Error.stackTraceLimit = Infinity

  const prepareStackTrace = Error.prepareStackTrace

  Error.prepareStackTrace = function prepareStackTrace(
    halt: Error,
    list: Array<NodeJS.CallSite>,
  ) {
    return saveLinkList(halt, list, tone)
  }

  const halt = new Halt({ base, code, form, host, link, text })
  halt.name = ''

  Error.captureStackTrace(halt)

  halt.stack

  Error.prepareStackTrace = prepareStackTrace

  return halt
}

export function saveHalt<
  B,
  N extends keyof B & string = keyof B & string,
>(list: Array<HaltMesh>, lead: unknown) {
  haveHalt<B, N>(lead)
  list.push(lead.toJSON())
}

export function testHalt<
  B,
  N extends keyof B & string = keyof B & string,
>(lead: unknown): lead is Halt<B, N> {
  return lead instanceof Halt
}
