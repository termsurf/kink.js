type Definition = {
  code: number
  note: (opts: Record<string, unknown>) => string
}

const errors = {
  invalid_form: {
    code: 3,
    note: ({ name }) => `Form '${name}' is not valid`,
  },
  invalid_type: {
    code: 2,
    note: ({ name, type }) => `Value '${name}' is not '${type}' type`,
  },
  missing_property: {
    code: 1,
    note: ({ name, another }) =>
      `Property '${name}' missing ${another}`,
  },
}

type Errors = typeof errors

type Name = keyof Errors

export type OmitIndexSignature<ObjectType> = {
  [KeyType in keyof ObjectType as {} extends Record<KeyType, unknown>
    ? never
    : KeyType]: ObjectType[KeyType]
}

function findError<N extends Name>(
  name: N,
  options: Parameters<Errors[N]['note']>[0],
) {
  const handler = errors[name] as unknown as Definition
  const text = handler?.note(options)
  return new Error(text)
}

findError('invalid_form', { name: 'any', type: 'asdf' })
