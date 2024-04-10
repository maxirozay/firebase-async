import {
  initializeFirestore,
  getFirestore,
  collection,
  getDocs as _getDocs,
  setDoc,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
  query,
  orderBy,
  where,
  limit,
  startAt,
  startAfter,
  getCountFromServer,
  getAggregateFromServer,
  count,
  sum,
  average,
  collectionGroup,
  onSnapshot as _onSnapshot,
  loadBundle,
  namedQuery,
  getDocsFromCache
} from 'firebase/firestore'

export class Firestore {
  constructor (app, config = {}) {
    initializeFirestore(app, config)
    this.firestore = getFirestore(app)

    this.orderBy = orderBy
    this.where = where
    this.limit = limit
    this.startAt = startAt
    this.startAfter = startAfter
    this.count = count
    this.sum = sum
    this.average = average
    this.loadBundle = loadBundle
    this.namedQuery = namedQuery
    this.getDocsFromCache = getDocsFromCache
  }

  async get (path, id) {
    const params = id ? [path, id] : [path]
    const ref = doc(this.firestore, ...params)
    const snapShot = await getDoc(ref)
    return {
      id,
      data: snapShot.data(),
      ref
    }
  }

  async onSnapshot (callback, path, id) {
    const params = id ? [path, id] : [path]
    const ref = doc(this.firestore, ...params)
    const unsub = _onSnapshot(ref, callback)
    return unsub
  }

  query (path, params, group) {
    let scope = collection
    if (group) scope = collectionGroup
    const ref = scope(this.firestore, path)
    if (params) {
      return query(ref, ...params)
    }
    return ref
  }

  async getDocs (path, params, group) {
    const snapShot = await _getDocs(this.query(path, params, group))
    const docs = []
    snapShot.forEach(doc => docs.push({
      id: doc.id,
      data: doc.data(),
      ref: doc.ref
    }))
    return docs
  }

  async countDocs (path, params, group) {
    const snapShot = await getCountFromServer(this.query(path, params, group))
    return snapShot.data().count
  }

  async aggregate (data, path, params, group) {
    const snapShot = await getAggregateFromServer(this.query(path, params, group), data)
    return snapShot.data()
  }

  async set (item, path) {
    if (item.id) {
      return setDoc(this.getRef(item, path), item.data)
    }
    const snapShot = await addDoc(collection(this.firestore, path), item.data)
    item.id = snapShot.id
    item.ref = snapShot.ref
  }

  async update (item, data, path) {
    return updateDoc(this.getRef(item, path), data)
  }

  async del (item, path) {
    return deleteDoc(this.getRef(item, path))
  }

  getRef (item, path) {
    if (!item.ref) {
      item.ref = doc(this.firestore, path, item.id)
    }
    return item.ref
  }
}
