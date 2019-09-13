// @flow

import * as t from 'graphql-ast-types'
import {
  isFunction,
  isString,
  isInteger,
  isNumber,
  isBoolean,
  isNil,
  isArray,
  isPlainObject,
  toPairs
} from 'lodash'
import {
  assertIsOfTypeOrNull,
  assertValidString,
  assertValidStringOrNull,
  assertValidOperation
} from './validation'
import { print } from 'graphql/language'

// GQL Helpers

export function jsToGQLValue (val) {
  if (t.isValue(val)) {
    return val
  }

  if (isBoolean(val)) {
    return t.booleanValue(val)
  }

  if (isNil(val)) {
    return t.nullValue()
  }

  if (isString(val)) {
    return t.stringValue(val)
  }

  if (isInteger(val)) {
    return t.intValue(val + '') // Ridiculous, but needed
  }

  if (isNumber(val)) {
    return t.floatValue(val + '') // Here too
  }

  if (isArray(val)) {
    return t.listValue(val.map(v => jsToGQLValue(v)))
  }

  if (isPlainObject(val)) {
    return t.objectValue(
      toPairs(val).map(pair =>
        t.objectField(t.name(pair[0]), jsToGQLValue(pair[1]))
      )
    )
  }

  throw new Error(
    `Could not guess GraphQL type of value ${val}. Please use types from 'graphql-ast-types', as 't.enumValue()' for example`
  )
}

// Builders

export class ArgumentList {
  constructor () {
    this.args = []
  }

  addArgument (name, value) {
    assertValidString(name, 'Argument name')
    const gqlValue = jsToGQLValue(value)
    const arg = { name, value: gqlValue }
    this.args.push(arg)
    return this
  }

  toASTNodeArray () {
    return this.args.map(({ name, value }) => t.argument(t.name(name), value))
  }

  static build (args) {
    let argumentList = new ArgumentList()
    if (isFunction(args)) {
      args(argumentList)
    } else if (isPlainObject(args)) {
      toPairs(args).forEach(([name, value]) => {
        argumentList.addArgument(name, value)
      })
    } else {
      assertIsOfTypeOrNull(args, ArgumentList)
      argumentList = args
    }

    return argumentList
  }
}

export class Field {
  constructor () {
    this.name = null
    this.alias = null
    this.argList = null
    this.selectionSet = null
  }

  setName (name) {
    assertValidString(name, 'Field name')
    this.name = name
    return this
  }

  setAlias (alias) {
    assertValidStringOrNull(alias, 'Field alias')
    this.alias = alias
    return this
  }

  /**
   * @param ArgumentList|Function<ArgumentList> args
   */
  setArguments (args = null) {
    if (args === null) {
      this.argList = null
      return this
    }

    this.argList = ArgumentList.build(args)
    return this
  }

  setSelectionSet (args = null) {
    if (args === null) {
      this.selectionSet = null
      return this
    }

    this.selectionSet = SelectionSet.build(args)
    return this
  }

  toASTNode () {
    return t.field(
      t.name(this.name),
      this.alias ? t.name(this.alias) : null,
      this.argList ? this.argList.toASTNodeArray() : null,
      null, // Ignoring directives
      this.selectionSet ? this.selectionSet.toASTNode() : null
    )
  }

  print () {
    return print(this.toASTNode())
  }

  // TODO : switch to single argument, for better semantics across builders
  static build (name, alias = null, args = null, selectionSet = null) {
    if (name instanceof Field) {
      return name
    }

    const field = new Field()
    field
      .setName(name)
      .setAlias(alias)
      .setArguments(args)
      .setSelectionSet(selectionSet)

    return field
  }
}

export class SelectionSet {
  constructor () {
    this.fields = []
  }

  addField (...args) {
    const field = Field.build(...args)
    this.fields.push(field)
    return this
  }

  toASTNode () {
    return t.selectionSet(
      this.fields.map(field => field.toASTNode())
    )
  }

  print () {
    return print(this.toASTNode())
  }

  static build (args) {
    if (args instanceof SelectionSet) return args

    const selectionSet = new SelectionSet()
    if (isArray(args)) {
      args.forEach(arg => {
        if (isArray(arg)) selectionSet.addField(...arg)
        else selectionSet.addField(arg)
      })
    } else if (isFunction(args)) {
      args(selectionSet)
    } else {
      throw new Error('Cannot build SelectionSet with given arguments')
    }

    return selectionSet
  }
}

export class OperationDefinition {
  constructor () {
    this.name = null
    this.selectionSet = new SelectionSet()
    this.operation = 'query'
  }

  addField (...args) {
    this.selectionSet.addField(...args)
    return this
  }

  setName (name) {
    assertValidStringOrNull(name, 'Operation name')
    this.name = name
    return this
  }

  setOperation (operation) {
    assertValidOperation(operation)
    this.operation = operation
    return this
  }

  setSelectionSet (...args) {
    this.selectionSet = SelectionSet.build(...args)
    return this
  }

  toASTNode () {
    return t.operationDefinition(
      this.operation,
      this.selectionSet.toASTNode(),
      this.name ? t.name(this.name) : null
    )
  }

  print () {
    return print(this.toASTNode())
  }

  /**
   * @param {string} type The type of the operation
   */
  static build (type, args) {
    if (type instanceof OperationDefinition) return type

    const operation = new OperationDefinition()
    let realArgs = type
    if (isString(type)) {
      operation.setOperation(type)
      realArgs = args
      if (isArray(args)) {
        realArgs = [type, ...args]
      }
    }
    if (isArray(realArgs)) {
      operation.setOperation(realArgs[0])
      operation.setSelectionSet(realArgs[1])
      operation.setName(realArgs[2])
    } else if (isFunction(realArgs)) {
      realArgs(operation)
    } else {
      throw new Error('Cannot build OperationDefinition with given arguments')
    }

    return operation
  }
}

export class Query extends OperationDefinition {
  static build (args) {
    return OperationDefinition.build('query', args)
  }
}

export class Mutation extends OperationDefinition {
  constructor () {
    super()
    this.operation = 'mutation'
  }

  static build (args) {
    return OperationDefinition.build('mutation', args)
  }
}

export class Subscription extends OperationDefinition {
  constructor () {
    super()
    this.operation = 'subscription'
  }

  static build (args) {
    return OperationDefinition.build('subscription', args)
  }
}

export class Document {
  constructor () {
    this.operations = []
  }

  addQuery (...args) {
    return this.addOperation('query', ...args)
  }

  addMutation (...args) {
    return this.addOperation('mutation', ...args)
  }

  addSubscription (...args) {
    return this.addOperation('subscription', ...args)
  }

  addOperation (type, ...args) {
    if (type instanceof OperationDefinition) {
      this.operations.push(type)
      return this
    }

    const operation = OperationDefinition.build(type, args)
    this.operations.push(operation)
    return this
  }

  static build (args) {
    const document = new Document()

    if (isArray(args)) {
      args.forEach(a => document.addOperation(a))
    } else if (isFunction(args)) {
      args(document)
    } else if (isPlainObject(args)) {
      ['query', 'mutation', 'subscription'].forEach((type) => {
        if (args[type]) {
          document.addOperation(type, args[type], args.name)
        }
      })
    } else {
      throw new Error('Cannot build Document with given arguments')
    }

    return document
  }

  toASTNode () {
    return t.document(this.operations.map(op => op.toASTNode()))
  }

  print () {
    return print(this.toASTNode())
  }
}
