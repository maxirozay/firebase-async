# Firebase Async
Firebase Async is a firebase wrapper to load firebase only when you need it so it's not bundled in the main file. It also simplifies functions calls.

# Getting started
## Load your config
```
import { loadConfig } from 'waterbase'
loadConfig({
  '[DEFAULT]': {
    app: // firebase app config,
    firestore: // optional firestore config
    functions: // optional functions config
  },
  otherAppName // call any loader function with the app name as last parameter to use this app
})
```
## Firestore
```
import { getDB } from 'waterbase'
const db = await getDB() // contains orderBy, where, limit, startAt, startAfter, count, sum, average
const doc = await db.get(path, id)
await db.set(doc, /* optional path if the doc doesn't hold its ref */)
await db.update(doc, data, /* optional path if the doc doesn't hold its ref */)
await db.del(doc, /* optional path if the doc doesn't hold its ref */)
const docs = await db.getDocs(path, [db.orderBy('date', 'desc')], isCollectionGroup)
(await db.count(path, [db.where('date', '<', Date.now())], isCollectionGroup)).count
(await db.aggreate({ sum: db.sum('points') }, path, [db.where('date', '<', Date.now())], isCollectionGroup)).sum
```
## Auth
```
import { getAuth } from 'waterbase'
const auth = await getAuth() // contains getAuth as auth, signOut, onAuthStateChanged
await auth.emailLink() // get email link functions
await auth.anonymous() // get anonymous functions
```
## Storage
```
import { getStorage } from 'waterbase'
const storage = await getStorage()
storage.uploadImage(src, path, height = 720, width, quality = 0.8, format = 'webp')
storage.formatImage(image, height, width)
storage.uploadFile(file, path, uploadSuccessHandler, progressHandler, metadata)
storage.download(path, name)
storage.deleteFile(path)
storage.deleteFolder(path)
```
## Functions
```
import { callFunction } from 'waterbase'
await callFunction('functionName', params)
```
## Emulator
```
import { emulate } from 'waterbase'
emulate()
```