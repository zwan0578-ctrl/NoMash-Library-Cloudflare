function uppercaseBookName(value) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed ? trimmed.toUpperCase() : null
}

function createUppercaseBookHandler(updateBook) {
  return async (snapshot) => {
    if (!snapshot) return null

    const currentName = snapshot.data()?.name
    const uppercaseName = uppercaseBookName(currentName)
    if (!uppercaseName || uppercaseName === currentName) return null

    await updateBook(snapshot, uppercaseName)
    return uppercaseName
  }
}

module.exports = { uppercaseBookName, createUppercaseBookHandler }
