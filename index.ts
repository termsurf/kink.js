/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomError } from 'ts-custom-error'

export type BaseHook<T extends any = any> = (
  link?: T,
) => KinkMeshBase & Link

export type FillHook<T extends any = any> = (link?: T) => Link

export type KinkMesh = {
  code: string
  file?: string
  form: string
  hint?: string
  host: string
  link?: Link
  note: string
  text?: string
}

export type KinkMeshBase = {
  code: number
  note: string
}

const base: Record<string, BaseHook> = {}
const fill: Record<string, FillHook> = {}
const code: Record<string, (code: number) => string> = {}

export default class Kink extends CustomError {
  form: string

  host: string

  code: string

  note: string

  file?: string

  text?: string

  hint?: string

  link: Link

  static base = (host: string, form: string, hook: BaseHook) => {
    base[`${host}:${form}`] = hook
    return Kink
  }

  static code = (host: string, hook: (code: number) => string) => {
    code[host] = hook
    return Kink
  }

  static fill = (host: string, form: string, hook: FillHook) => {
    fill[`${host}:${form}`] = hook
    return Kink
  }

  static makeBase = (host: string, form: string, link?: any) => {
    const hook = base[`${host}:${form}`]
    if (!hook) {
      throw new Error(`Missing ${host}:${form} in Kink.base`)
    }
    const hookLink = hook(link) as KinkMeshBase & Link
    return {
      ...hookLink,
      code: Kink.makeCode(host, hookLink.code),
      form,
      host,
    }
  }

  static makeFill = (host: string, form: string, link?: Link) => {
    const hook = fill[`${host}:${form}`]
    if (!hook) {
      throw new Error(`Missing ${host}:${form} in Kink.fill`)
    }
    const baseFill = Kink.makeBase(host, form, link)
    return {
      ...baseFill,
      ...hook(link),
    }
  }

  static makeCode = (host: string, codeLink: number) => {
    const hook = code[host]
    if (!hook) {
      return codeLink.toString()
    }
    return hook(codeLink)
  }

  constructor({
    host,
    note,
    form,
    link = {},
    file,
    text,
    hint,
    code,
  }: KinkMesh) {
    super(note)

    Object.defineProperty(this, 'file', {
      enumerable: false,
      value: file,
      writable: true,
    })

    Object.defineProperty(this, 'text', {
      enumerable: false,
      value: text,
      writable: true,
    })

    Object.defineProperty(this, 'hint', {
      enumerable: false,
      value: hint,
      writable: true,
    })

    Object.defineProperty(this, 'note', {
      enumerable: false,
      value: note,
      writable: true,
    })

    Object.defineProperty(this, 'host', {
      enumerable: false,
      value: host,
      writable: true,
    })

    Object.defineProperty(this, 'code', {
      enumerable: false,
      value: code,
      writable: true,
    })

    Object.defineProperty(this, 'form', {
      enumerable: false,
      value: form,
      writable: true,
    })

    Object.defineProperty(this, 'link', {
      enumerable: false,
      value: link,
      writable: true,
    })

    Object.defineProperty(this, 'name', {
      enumerable: false,
      value: '',
      writable: true,
    })

    this.host = host
    this.file = file
    this.text = text
    this.hint = hint
    this.code = code
    this.note = note
    this.link = link
    this.form = form
  }

  toJSON(): KinkMesh {
    return {
      code: this.code,
      file: this.file,
      form: this.form,
      hint: this.hint,
      host: this.host,
      link: this.link,
      note: this.note,
      text: this.text,
    }
  }
}

export type Link = Record<string, unknown>
