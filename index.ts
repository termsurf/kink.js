import { CustomError } from 'ts-custom-error'

export type KinkMeshBase = {
  code: number
  note: string
}

export type KinkMesh = {
  host: string
  link: Link
  form: string
  code: string
  note: string
}

export type Hook = (link?: Link) => Link & KinkMeshBase

const base: Record<string, Hook> = {}
const fill: Record<string, Hook> = {}
const code: Record<string, (code: number) => string> = {}
const show: Record<string, (link?: Link) => string> = {}

export default class Kink extends CustomError {
  form: string

  host: string

  code: string

  note: string

  link: Link

  static base = (host: string, form: string, hook: Hook) => {
    base[`${host}:${form}`] = hook
    return Kink
  }

  static code = (host: string, hook: (code: number) => string) => {
    code[host] = hook
    return Kink
  }

  static fill = (host: string, form: string, hook: Hook) => {
    fill[`${host}:${form}`] = hook
    return Kink
  }

  static makeBase = (host: string, form: string, link?: any) => {
    const hook = base[`${host}:${form}`]
    if (!hook) {
      throw new Error(`Missing ${host}:${form} in Kink.base`)
    }
    const hookLink = hook(link)
    return {
      ...hookLink,
      code: Kink.makeCode(host, hookLink.code),
      host,
      form,
      link,
    }
  }

  static makeFill = (host: string, form: string, link?: Link) => {
    const hook = fill[`${host}:${form}`]
    if (!hook) {
      throw new Error(`Missing ${host}:${form} in Kink.fill`)
    }
    return hook(link)
  }

  static makeCode = (host: string, codeLink: number) => {
    const hook = code[host]
    if (!hook) {
      return codeLink.toString()
    }
    return hook(codeLink)
  }

  static makeShow = (host: string, form: string, link?: Link) => {
    const hook = show[form]
    if (!hook) {
      throw new Error(`Missing ${host}:${form} in Kink.show`)
    }
    return hook(link)
  }

  static show = (host: string, form: string, hook: (link?: Link) => string) => {
    show[`${host}:${form}`] = hook
    return Kink
  }

  constructor({ host, note, form, link = {}, code }: KinkMesh) {
    super(note)

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
    this.code = code
    this.note = note
    this.link = link
    this.form = form
  }

  toJSON(): KinkMesh {
    return {
      code: this.code,
      host: this.host,
      link: this.link,
      form: this.form,
      note: this.note,
    }
  }
}

export type Link = Record<string, unknown>
