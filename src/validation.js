import { trim, isNil } from 'lodash'

function _orNullDecorator (fn) {
  return function (arg, ...rest) {
    if (isNil(arg)) return
    return fn(arg, ...rest)
  }
}

export function assertValidString (str, name) {
  const trimmed = trim(str)
  if (trimmed === '') {
    throw new Error(`${name} should not be empty`)
  }
}

export const assertValidStringOrNull = _orNullDecorator(assertValidString)

export function assertIsOfType (obj, type) {
  if (!(obj instanceof type)) {
    throw new Error(`${obj} is not an instance of ${type}`)
  }
}

export const assertIsOfTypeOrNull = _orNullDecorator(assertIsOfType)

export function assertValidOperation (operation) {
  if (['query', 'mutation', 'subscription'].indexOf(operation) === -1) {
    throw new Error(`${operation} is not a valid operation (query, mutation or subscription)`)
  }
}
