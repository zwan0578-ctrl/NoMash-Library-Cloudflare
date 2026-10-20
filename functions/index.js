const { onRequest } = require('firebase-functions/v2/https')
const { onDocumentCreated } = require('firebase-functions/v2/firestore')
const admin = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const cors = require('cors')({ origin: true, methods: ['GET'] })
const { createUppercaseBookHandler } = require('./uppercase-book')

admin.initializeApp()
const db = getFirestore()

exports.countBooks = onRequest(
  { region: 'australia-southeast2', maxInstances: 2, invoker: 'public' },
  (req, res) =>
    cors(req, res, async () => {
      res.set('Cache-Control', 'no-store')
      if (req.method !== 'GET') {
        res.set('Allow', 'GET')
        return res.status(405).json({ error: 'Method not allowed' })
      }

      try {
        const booksSnapshot = await db.collection('books').get()
        return res.status(200).json({ count: booksSnapshot.size })
      } catch (error) {
        console.error('Unable to count books:', error)
        return res.status(500).json({ error: 'Unable to count books' })
      }
    })
)

// Week 10.2: expose the library catalogue as a JSON REST endpoint.
exports.getAllBooks = onRequest(
  { region: 'australia-southeast2', maxInstances: 2, invoker: 'public' },
  (req, res) =>
    cors(req, res, async () => {
      res.set('Cache-Control', 'no-store')
      if (req.method !== 'GET') {
        res.set('Allow', 'GET')
        return res.status(405).json({ error: 'Method not allowed' })
      }

      try {
        const booksSnapshot = await db.collection('books').get()
        const books = booksSnapshot.docs.map((document) => ({
          id: document.id,
          ...document.data()
        }))
        return res.status(200).json(books)
      } catch (error) {
        console.error('Unable to retrieve books:', error)
        return res.status(500).json({ error: 'Unable to retrieve books' })
      }
    })
)

// Week 9.2: automatically normalise the name of every newly created book.
const uppercaseBook = createUppercaseBookHandler((snapshot, name) => snapshot.ref.update({ name }))

exports.capitalizeBookName = onDocumentCreated(
  { document: 'books/{bookId}', region: 'australia-southeast2', maxInstances: 2 },
  (event) => uppercaseBook(event.data)
)
