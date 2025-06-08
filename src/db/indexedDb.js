const DB_NAME = 'management-db'
const STORE_NAME = 'items'
const DB_VERSION = 3 // oder 3, falls du schon mal 2 verwendet hast

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains('movies')) {
        db.createObjectStore('movies', { keyPath: 'id', autoIncrement: true })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getAllItems() {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function addItem(item) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.add(item)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function updateItem(item) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.put(item)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function deleteItem(id) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.delete(id)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// --- Movies CRUD ---
export async function getAllMovies() {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('movies', 'readonly')
    const store = tx.objectStore('movies')
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function addMovie(movie) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('movies', 'readwrite')
    const store = tx.objectStore('movies')
    const request = store.add(movie)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function updateMovie(movie) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('movies', 'readwrite')
    const store = tx.objectStore('movies')
    const request = store.put(movie)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function deleteMovie(id) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('movies', 'readwrite')
    const store = tx.objectStore('movies')
    const request = store.delete(id)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// --- Actors CRUD ---
export async function getAllActors() {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('actors', 'readonly')
    const store = tx.objectStore('actors')
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function addActor(actor) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('actors', 'readwrite')
    const store = tx.objectStore('actors')
    const request = store.add(actor)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function updateActor(actor) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('actors', 'readwrite')
    const store = tx.objectStore('actors')
    const request = store.put(actor)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function deleteActor(id) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('actors', 'readwrite')
    const store = tx.objectStore('actors')
    const request = store.delete(id)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// --- MovieActors (Relation) ---
// Speichert für einen Film die zugeordneten Schauspieler (Liste von actorIds)
export async function assignActorsToMovie(movieId, actorIds) {
  const db = await openDb()
  // Erst alle bisherigen Zuordnungen für diesen Film löschen
  await new Promise((resolve, reject) => {
    const tx = db.transaction('movieActors', 'readwrite')
    const store = tx.objectStore('movieActors')
    const indexRequest = store.openCursor()
    indexRequest.onsuccess = (event) => {
      const cursor = event.target.result
      if (cursor) {
        if (cursor.value.movieId === movieId) {
          cursor.delete()
        }
        cursor.continue()
      } else {
        resolve()
      }
    }
    indexRequest.onerror = () => reject(indexRequest.error)
  })
  // Neue Zuordnungen anlegen
  for (const actorId of actorIds) {
    await new Promise((resolve, reject) => {
      const tx = db.transaction('movieActors', 'readwrite')
      const store = tx.objectStore('movieActors')
      const request = store.add({ movieId, actorId })
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}

// Gibt alle actorIds für einen Film zurück
export async function getActorsForMovie(movieId) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('movieActors', 'readonly')
    const store = tx.objectStore('movieActors')
    const actors = []
    const request = store.openCursor()
    request.onsuccess = (event) => {
      const cursor = event.target.result
      if (cursor) {
        if (cursor.value.movieId === movieId) {
          actors.push(cursor.value.actorId)
        }
        cursor.continue()
      } else {
        resolve(actors)
      }
    }
    request.onerror = () => reject(request.error)
  })
}

// Gibt alle movieIds für einen Schauspieler zurück (optional)
export async function getMoviesForActor(actorId) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('movieActors', 'readonly')
    const store = tx.objectStore('movieActors')
    const movies = []
    const request = store.openCursor()
    request.onsuccess = (event) => {
      const cursor = event.target.result
      if (cursor) {
        if (cursor.value.actorId === actorId) {
          movies.push(cursor.value.movieId)
        }
        cursor.continue()
      } else {
        resolve(movies)
      }
    }
    request.onerror = () => reject(request.error)
  })
}




