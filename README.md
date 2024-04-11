# Firebase Async
Firebase Async is a firebase wrapper to load firebase only when you need it so it's not bundled in the main file. It also simplifies functions calls.

# Getting started
## Load your config
```
import { loadConfig } from 'firebase-async'
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
import { getDB } from 'firebase-async'
const db = await getDB(/* set `true` to load the full SDK, a second param will enable persistance if set to `true` */)
const doc = await db.get(path, id)
await db.set(doc, /* optional path if the doc doesn't hold its ref */)
await db.update(doc, data, /* optional path if the doc doesn't hold its ref */)
await db.del(doc, /* optional path if the doc doesn't hold its ref */)
const docs = await db.getDocs(path, [db.orderBy('date', 'desc')], isCollectionGroup)
(await db.count(path, [db.where('date', '<', Date.now())], isCollectionGroup)).count
(await db.aggreate({ sum: db.sum('points') }, path, [db.where('date', '<', Date.now())], isCollectionGroup)).sum
db.enablePersistance()
```
## Auth
```
import { getAuth } from 'firebase-async'
const auth = await getAuth() // contains getAuth as auth, signOut, onAuthStateChanged
await auth.emailLink() // get email link functions
await auth.anonymous() // get anonymous functions
```
## Storage
```
import { getStorage } from 'firebase-async'
const storage = await getStorage()
storage.uploadImage(src, path, height, width, quality = 0.8, format = 'webp', maxPixels, contain)
storage.formatImage(image, height, width)
storage.uploadFile(file, path, uploadSuccessHandler, progressHandler, metadata)
storage.download(path, name)
storage.deleteFile(path)
storage.deleteFolder(path)
```
## Functions
```
import { callFunction } from 'firebase-async'
await callFunction('functionName', params)
```
## Emulator
```
import { emulate } from 'firebase-async'
emulate()
```