/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomError } from 'ts-custom-error'

export type BaseHook<T extends any = any> = (
  take?: T,
) => KinkMeshBase & Link

export type FillHook<T extends any = any, U extends any = any> = (
  take?: T,
  load?: U,
) => Link

export type KinkMesh = {
  code: string
  form: string
  host: string
  link?: Link
  note: string
  // HTTP code
  siteCode?: number
  take?: Link
}

export type KinkMeshBase = {
  code: number
  note: string
}

const base: Record<string, BaseHook> = {}
const load: Record<string, LoadHook> = {}
const fill: Record<string, FillHook> = {}
const code: Record<string, (code: number) => string> = {}

export type Link = Record<string, unknown>

export default class Kink extends CustomError {
  form: string

  host: string

  code: string

  note: string

  link: Link

  siteCode?: number

  take?: Link

  static base = (host: string, form: string, hook: BaseHook) => {
    base[`${host}:${form}`] = hook
    return Kink
  }

  static code = (host: string, hook: (code: number) => string) => {
    code[host] = hook
    return Kink
  }

  static load = (host: string, form: string, hook: LoadHook) => {
    load[`${host}:${form}`] = hook
    return Kink
  }

  static fill = (host: string, form: string, hook: FillHook) => {
    fill[`${host}:${form}`] = hook
    return Kink
  }

  static make = (host: string, form: string, take?: any) => {
    const hook = base[`${host}:${form}`]
    if (!hook) {
      throw new Error(`Missing ${host}:${form} in Kink.base`)
    }
    const hookLink = hook(take) as KinkMeshBase & Link
    const kink = new Kink({
      ...hookLink,
      code: Kink.makeCode(host, hookLink.code),
      form,
      host,
      take: take as Link,
    })

    Kink.saveLoad(kink, take)

    return kink
  }

  static saveLoad = (kink: Kink, take?: any) => {
    const hook = load[`${kink.host}:${kink.form}`]
    if (!hook) {
      // throw new Error(`Missing ${kink.host}:${kink.form} in Kink.load`)
      return
    }
    kink.link = hook(take)
  }

  static saveFill = (kink: Kink) => {
    const hook = fill[`${kink.host}:${kink.form}`]
    if (!hook) {
      // throw new Error(`Missing ${kink.host}:${kink.form} in Kink.fill`)
      return
    }
    kink.link = hook(kink.take, kink.link)
  }

  static makeCode = (host: string, codeLink: number) => {
    const hook = code[host]
    if (!hook) {
      return codeLink.toString()
    }
    return hook(codeLink)
  }

  static makeBase = (kink: Error, { stack = false } = {}) => {
    return {
      code:
        'code' in kink && typeof kink.code === 'string'
          ? kink.code
          : '0000',
      host: 'system',
      list: stack ? kink.stack?.split('\n') ?? [] : undefined,
      note: kink.message,
    }
  }

  constructor({
    siteCode,
    host,
    note,
    form,
    take,
    link = {},
    code,
  }: KinkMesh) {
    super(note)

    Object.defineProperty(this, 'name', {
      enumerable: false,
      value: '',
      writable: true,
    })

    Object.defineProperty(this, 'take', {
      enumerable: false,
      value: take,
      writable: true,
    })

    this.host = host
    this.form = form
    this.code = code
    this.note = note
    this.link = link
    this.take = take
    this.siteCode = siteCode
  }

  toJSON(): KinkMesh {
    return {
      code: this.code,
      form: this.form,
      host: this.host,
      link: this.link,
      note: this.note,
    }
  }
}

export type LoadHook<T extends any = any> = (take?: T) => Link

// eslint-disable-next-line sort-exports/sort-exports
export class KinkList extends Kink {
  list: Array<Kink>

  constructor(list: Array<Kink>) {
    super({
      code: '0000',
      form: 'list',
      host: '@termsurf/kink',
      note: 'A set of errors occurred',
    })
    this.list = list
  }
}
