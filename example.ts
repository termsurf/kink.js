import makeHalt, { Link } from './index'

type WithName = {
  name: string
}

type WithType = WithName & {
  type: string
}

const base = {
  invalid_form: {
    code: 3,
    note: ({ name }: WithName) => `Form '${name}' is not valid`,
  },
  invalid_type: {
    code: 2,
    note: ({ name, type }: WithType) =>
      `Value '${name}' is not '${type}' type`,
  },
  missing_property: {
    code: 1,
    note: ({ name }: WithName) => `Property '${name}' missing`,
  },
}

type Base = typeof base

type Name = keyof Base

export default function halt(form: Name, link: Link<Base, Name>) {
  return makeHalt({ base, form, link })
}
