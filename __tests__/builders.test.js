import { ArgumentList, Field, SelectionSet, OperationDefinition, Document, Query, Mutation, Subscription } from '../src'
import * as t from 'graphql-ast-types'

describe('ArgumentList builder', () => {
  test('as function', () => {
    const list = ArgumentList.build((list) => {
      expect(list).toBeInstanceOf(ArgumentList)
      list.addArgument('test', 'value')
      list.addArgument('test2', 5)
    })

    expect(list.toASTNodeArray()).toMatchSnapshot()
  })

  test('as object', () => {
    const list = ArgumentList.build({
      test: 'value',
      test2: 5
    })

    expect(list.toASTNodeArray()).toMatchSnapshot()
  })
})

describe('Field builder', () => {
  test('builder', () => {
    let field = Field.build('name').toASTNode()
    expect(field.name.value).toBe('name')

    field = Field.build('name', 'alias').toASTNode()
    expect(field.alias.value).toBe('alias')

    field = Field.build('name', null, { arg: 'list' }).toASTNode()
    field.arguments.forEach(arg => expect(t.isArgument(arg)).toBe(true))

    field = Field.build('name', null, null, ['field1', 'field2']).toASTNode()
    expect(t.isSelectionSet(field.selectionSet)).toBe(true)
  })
})

describe('SelectionSet builder', () => {
  test('as array', () => {
    const selectionSet = SelectionSet.build(['field', ['name', 'alias', { args: true }, ['nested', ['fields']]]])
    expect(selectionSet.toASTNode()).toMatchSnapshot()
  })

  test('as function', () => {
    const selectionSet = SelectionSet.build((set) => {
      expect(set).toBeInstanceOf(SelectionSet)
      set.addField('name')
      set.addField('other', 'alias')
      set.addField('with', null, { args: 'too' })
      set.addField('nested', null, null, ['fieldsAsArray'])
      set.addField('or', null, null, (set) => {
        expect(set).toBeInstanceOf(SelectionSet)
        set.addField('asFunction')
      })
    }).toASTNode()

    expect(selectionSet).toMatchSnapshot()
  })
})

describe('OperationDefinition builders', () => {
  test('as array', () => {
    const operation = OperationDefinition.build([
      'mutation',
      [
        'field1',
        ['field2', 'alias']
      ],
      'mutationName'
    ]).toASTNode()

    expect(t.isOperationDefinition(operation)).toBe(true)
    expect(operation.name.value).toBe('mutationName')
    expect(t.isSelectionSet(operation.selectionSet)).toBe(true)
    expect(operation.operation).toBe('mutation')
  })

  test('as function', () => {
    const operation = OperationDefinition.build((op) => {
      expect(op).toBeInstanceOf(OperationDefinition)
      op
        .setName('mutationName')
        .setOperation('mutation')
        .addField('field1')
        .addField('field2', null, { args: 1 })
    }).toASTNode()

    expect(t.isOperationDefinition(operation)).toBe(true)
    expect(operation.name.value).toBe('mutationName')
    expect(t.isSelectionSet(operation.selectionSet)).toBe(true)
    expect(operation.operation).toBe('mutation')
  })

  test('with type prefix', () => {
    {
      const operation = OperationDefinition.build('mutation', [
        [
          'field1',
          ['field2', 'alias']
        ],
        'mutationName'
      ]).toASTNode()

      expect(t.isOperationDefinition(operation)).toBe(true)
      expect(operation.operation).toBe('mutation')
    }
    {
      const operation = OperationDefinition.build('subscription', (op) => {
        expect(op).toBeInstanceOf(OperationDefinition)
        op
          .addField('field1')
          .addField('field2', null, { args: 1 })
      }).toASTNode()

      expect(t.isOperationDefinition(operation)).toBe(true)
      expect(operation.operation).toBe('subscription')
    }
  })

  test('operation aliases', () => {
    {
      const operation = Mutation.build([
        [
          'field1',
          ['field2', 'alias']
        ],
        'mutationName'
      ]).toASTNode()

      expect(t.isOperationDefinition(operation)).toBe(true)
      expect(operation.operation).toBe('mutation')
    }
    {
      const operation = Subscription.build((op) => {
        expect(op).toBeInstanceOf(OperationDefinition)
        op
          .addField('field1')
          .addField('field2', null, { args: 1 })
      }).toASTNode()

      expect(t.isOperationDefinition(operation)).toBe(true)
      expect(operation.operation).toBe('subscription')
    }
    {
      const operation = Query.build((op) => {
        expect(op).toBeInstanceOf(OperationDefinition)
        op
          .addField('field1')
          .addField('field2', null, { args: 1 })
          .setName('named')
      }).toASTNode()

      expect(t.isOperationDefinition(operation)).toBe(true)
      expect(operation.operation).toBe('query')
      expect(operation.name.value).toBe('named')
    }
  })
})

describe('Document builder', () => {
  test('as array', () => {
    const document = Document.build([
      [
        'mutation',
        [
          'field1',
          ['field2', 'alias']
        ]
      ],
      [
        'query',
        (query) => {
          query.addField('test')
        },
        'named'
      ]
    ]).toASTNode()

    expect(t.isDocument(document)).toBe(true)
    expect(document.definitions[0].operation).toBe('mutation')
    expect(document.definitions[0].selectionSet.selections[0].name.value).toBe('field1')
    expect(document.definitions[0].selectionSet.selections[1].name.value).toBe('field2')
    expect(document.definitions[0].selectionSet.selections[1].alias.value).toBe('alias')
    expect(document.definitions[1].operation).toBe('query')
    expect(document.definitions[1].name.value).toBe('named')
    expect(document.definitions[1].selectionSet.selections[0].name.value).toBe('test')
  })

  test('as function', () => {
    const document = Document.build((d) => {
      d
        .addMutation([
          'field1',
          ['field2', 'alias']
        ])
        .addQuery(
          (query) => {
            query.addField('test')
          },
          'named'
        )
    }).toASTNode()

    expect(t.isDocument(document)).toBe(true)
    expect(document.definitions[0].operation).toBe('mutation')
    expect(document.definitions[0].selectionSet.selections[0].name.value).toBe('field1')
    expect(document.definitions[0].selectionSet.selections[1].name.value).toBe('field2')
    expect(document.definitions[0].selectionSet.selections[1].alias.value).toBe('alias')
    expect(document.definitions[1].operation).toBe('query')
    expect(document.definitions[1].name.value).toBe('named')
    expect(document.definitions[1].selectionSet.selections[0].name.value).toBe('test')
  })

  test('as object shortcut', () => {
    {
      // Testing shorthand for single operation doucment
      const document = Document.build({
        mutation: [
          'field1',
          ['field2', 'alias']
        ]
      }).toASTNode()
      expect(t.isDocument(document)).toBe(true)
      expect(document.definitions[0].operation).toBe('mutation')
      expect(document.definitions[0].selectionSet.selections[0].name.value).toBe('field1')
      expect(document.definitions[0].selectionSet.selections[1].name.value).toBe('field2')
      expect(document.definitions[0].selectionSet.selections[1].alias.value).toBe('alias')
    }
    {
      // Testing shorthand for single operation doucment
      const document = Document.build({
        name: 'named',
        query: (q) => {
          q.addField('test')
        }
      }).toASTNode()

      expect(t.isDocument(document)).toBe(true)
      expect(document.definitions[0].operation).toBe('query')
      expect(document.definitions[0].name.value).toBe('named')
      expect(document.definitions[0].selectionSet.selections[0].name.value).toBe('test')
    }
  })
})
