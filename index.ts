import { CustomError } from 'ts-custom-error'

export class Halt extends CustomError {
  form: keyof HaltList

  link: HaltLink

  static list: HaltList = {}

  // make your codes cool.
  static code: (code: number) => string = (code: number) =>
    code.toString(16).padStart(4, '0').toUpperCase()

  // your template for rendering codes.
  static make: (host: string, code: string, note: string) => string = (
    host: string,
    code: string,
    note: string,
  ) => `[${host}:${code}] ${note}`

  constructor(form: keyof HaltList, link: HaltLink = {}) {
    if (!(form in Halt.list)) {
      throw new Error(`Name ${form} missing from halt list`)
    }

    const hook = Halt.list[form]

    if (!hook) {
      throw new Error(`Hook ${form} is missing from halt list`)
    }

    const note =
      typeof hook.note === 'function' ? hook.note(link) : hook.note
    const code = Halt.code(hook.code)
    const text = Halt.make(hook.host, code, note)

    super(text)

    Object.defineProperty(this, 'form', {
      enumerable: false,
      value: form,
    })

    Object.defineProperty(this, 'link', {
      enumerable: false,
      value: link,
    })

    this.form = form
    this.link = link

    Object.defineProperty(this, 'name', { value: 'Halt' })
  }

  toJSON() {
    const hook = Halt.list[this.form]

    if (!hook) {
      throw new Error()
    }

    const note =
      typeof hook.note === 'function' ? hook.note(this.link) : hook.note
    const code = Halt.code(hook.code)
    const term = hook.term

    return { code, note, term }
  }
}

export type HaltHook = {
  code: number
  hint?: string | ((link: HaltLink) => string)
  // the project defining this
  host: string
  note: string | ((link: HaltLink) => string)
  term?: Array<string> | ((link: HaltLink) => Array<string>)
}

export type HaltLink = Record<string, unknown>

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface HaltList {
  [key: string]: HaltHook
}

export function assertHalt(x: unknown): asserts x is Halt {
  if (!isHalt(x)) {
    throw new Error('Error is not a halt. ' + (x as Error).message)
  }
}

export function isHalt(x: unknown): x is Halt {
  return x instanceof Halt
}

export default function halt(
  form: keyof HaltList,
  link: HaltLink = {},
) {
  throw new Halt(form, link)
}
