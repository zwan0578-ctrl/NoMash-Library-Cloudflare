const { test } = require('node:test')
const assert = require('node:assert/strict')
const { uppercaseBookName, createUppercaseBookHandler } = require('./uppercase-book')

test('converts a new book name to uppercase', () => {
  assert.equal(uppercaseBookName('  the hobbit  '), 'THE HOBBIT')
})

test('ignores missing and blank book names', () => {
  assert.equal(uppercaseBookName(), null)
  assert.equal(uppercaseBookName('   '), null)
})

test('updates a newly created lowercase book', async () => {
  const updates = []
  const handler = createUppercaseBookHandler(async (_snapshot, name) => updates.push(name))

  const result = await handler({ data: () => ({ name: 'cloud functions' }) })

  assert.equal(result, 'CLOUD FUNCTIONS')
  assert.deepEqual(updates, ['CLOUD FUNCTIONS'])
})

test('does not write when the name is already uppercase', async () => {
  let updated = false
  const handler = createUppercaseBookHandler(async () => { updated = true })

  const result = await handler({ data: () => ({ name: 'FIREBASE' }) })

  assert.equal(result, null)
  assert.equal(updated, false)
})
