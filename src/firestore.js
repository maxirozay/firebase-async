import * as firestoreLite from 'firebase/firestore/lite'

export class Firestore {
  constructor (app, config = {}) {
    this.firestore = firestoreLite.initializeFirestore(app, config)
    this.app = app

    this._getDocs = firestoreLite.getDocs
    this._query = firestoreLite.query
    for (const key in firestoreLite) {
      if (!this['_' + key]) this[key] = firestoreLite[key]
    }
  }

  async loadExtra () {
    if (this.isFull) return
    const firestore = await import('./firestoreFull')
    this.firestore = firestore.getFirestore(this.app)
    this._getDocs = firestore.getDocs
    this._query = firestore.query
    for (const key in firestore) {
      if (!this['_' + key]) this[key] = firestore[key]
    }
    this.isFull = true
  }

  getRef (path, id) {
    const params = id ? [path, id] : [path]
    return this.doc(this.firestore, ...params)
  }

  async get (path, id) {
    const ref = this.getRef(path, id)
    const snapShot = await this.getDoc(ref)
    return {
      id,
      data: snapShot.data(),
      ref
    }
  }

  query (path, params, group) {
    let scope = this.collection
    if (group) scope = this.collectionGroup
    const ref = scope(this.firestore, path)
    if (params) {
      return this._query(ref, ...params)
    }
    return ref
  }

  async getDocs (path, params, group) {
    const snapShot = await this._getDocs(this.query(path, params, group))
    const docs = []
    snapShot.forEach(doc => docs.push({
      id: doc.id,
      data: doc.data(),
      ref: doc.ref
    }))
    return docs
  }

  async countDocs (path, params, group) {
    await this.loadExtra()
    const snapShot = await this.getCountFromServer(this.query(path, params, group))
    return snapShot.data().count
  }

  async aggregate (data, path, params, group) {
    await this.loadExtra()
    const snapShot = await this.getAggregateFromServer(this.query(path, params, group), data)
    return snapShot.data()
  }

  async set (item, path) {
    if (item.id) {
      return this.setDoc(this.getItemRef(item, path), item.data)
    }
    const snapShot = await this.addDoc(this.collection(this.firestore, path), item.data)
    item.id = snapShot.id
    item.ref = snapShot.ref
  }

  async update (item, data, path) {
    return this.updateDoc(this.getItemRef(item, path), data)
  }

  async del (item, path) {
    return this.deleteDoc(this.getItemRef(item, path))
  }

  getItemRef (item, path) {
    if (!item.ref) {
      item.ref = this.getRef(path, item.id)
    }
    return item.ref
  }
}
