import { jsToGQLValue } from '../src'
import * as t from 'graphql-ast-types'

/* eslint-env jest */

describe('jsToGQLValue', () => {
  test('return NodeValue', () => {
    const NodeValue = t.enumValue('TEST')
    const ret = jsToGQLValue(NodeValue)
    expect(ret).toBe(NodeValue)
  })

  test('primitive types', () => {
    expect(t.isIntValue(jsToGQLValue(4))).toBe(true)
    expect(t.isFloatValue(jsToGQLValue(5.1))).toBe(true)
    expect(t.isNullValue(jsToGQLValue(null))).toBe(true)
    expect(t.isNullValue(jsToGQLValue(undefined))).toBe(true)
    expect(t.isStringValue(jsToGQLValue(' '))).toBe(true)
    expect(t.isBooleanValue(jsToGQLValue(true))).toBe(true)
    expect(t.isBooleanValue(jsToGQLValue(false))).toBe(true)
  })

  test('array', () => {
    const list = jsToGQLValue([4, 5.1, null, '', [true]])
    expect(t.isListValue(list)).toBe(true)
    expect(t.isIntValue(list.values[0])).toBe(true)
    expect(t.isFloatValue(list.values[1])).toBe(true)
    expect(t.isNullValue(list.values[2])).toBe(true)
    expect(t.isStringValue(list.values[3])).toBe(true)
    expect(t.isListValue(list.values[4])).toBe(true)
    expect(t.isBooleanValue(list.values[4].values[0])).toBe(true)
  })

  test('object', () => {
    const obj = jsToGQLValue({
      int: 1,
      float: 1.5,
      null: null,
      string: 'yep',
      array: ['sure'],
      object: {
        it: 'works'
      }
    })

    expect(t.isObjectValue(obj)).toBe(true)

    obj.fields.forEach((field, idx) => {
      expect(t.isObjectField(field)).toBe(true)
      expect(t.isName(field.name)).toBe(true)

      switch (idx) {
        case 0:
          expect(t.isIntValue(field.value)).toBe(true)
          break
        case 1:
          expect(t.isFloatValue(field.value)).toBe(true)
          break
        case 2:
          expect(t.isNullValue(field.value)).toBe(true)
          break
        case 3:
          expect(t.isStringValue(field.value)).toBe(true)
          break
        case 4:
          expect(t.isListValue(field.value)).toBe(true)
          expect(t.isStringValue(field.value.values[0]))
          break
        case 5:
          expect(t.isObjectValue(field.value)).toBe(true)
          expect(t.isObjectField(field.value.fields[0])).toBe(true)
          break
      }
    })
  })
})
