/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomError } from 'ts-custom-error'

export type HaltMesh = {
  code: string
  host: string
  link: Link
  name: string
  note: string
}

export type Hook = (link: Link) => Link

const base: Record<string, Hook> = {}
const head: Record<string, Hook> = {}
const code: Record<string, (code: number) => string> = {}
const show: Record<string, (link: Link) => string> = {}

const Halt = {
  base: (host: string, name: string, hook: Hook) => {
    base[`${host}:${name}`] = hook
    return Halt
  },
  code: (host: string, hook: (code: number) => string) => {
    code[host] = hook
    return Halt
  },
  head: (host: string, name: string, hook: Hook) => {
    head[`${host}:${name}`] = hook
    return Halt
  },
  makeBase: (host: string, name: string, link: Link) => {
    const hook = base[name]
    if (!hook) {
      throw new Error(`Missing ${host}:${name} in Halt.base`)
    }
    return {
      ...hook(link),
      host,
      name,
    }
  },
  makeHead: (host: string, name: string, link: Link) => {
    const hook = head[name]
    if (!hook) {
      throw new Error(`Missing ${host}:${name} in Halt.head`)
    }
    return hook(link)
  },
  makeShow: (host: string, name: string, link: Link) => {
    const hook = show[name]
    if (!hook) {
      throw new Error(`Missing ${host}:${name} in Halt.show`)
    }
    return hook(link)
  },
  show: (host: string, name: string, hook: (link: Link) => string) => {
    show[`${host}:${name}`] = hook
    return Halt
  },
}

export default class Kink extends CustomError {
  host: string

  code: string

  note: string

  link: Link

  constructor({ host, note, name, link = {}, code }: HaltMesh) {
    super(note)

    Object.defineProperty(this, 'note', {
      enumerable: false,
      value: note,
    })

    Object.defineProperty(this, 'host', {
      enumerable: false,
      value: host,
    })

    Object.defineProperty(this, 'code', {
      enumerable: false,
      value: code,
    })

    Object.defineProperty(this, 'name', {
      enumerable: false,
      value: name,
    })

    Object.defineProperty(this, 'link', {
      enumerable: false,
      value: link,
    })

    this.host = host
    this.code = code
    this.note = note
    this.link = link
    this.name = name
  }

  toJSON(): HaltMesh {
    return {
      code: this.code,
      host: this.host,
      link: this.link,
      name: this.name,
      note: this.note,
    }
  }
}

export type Link = Record<string, unknown>
