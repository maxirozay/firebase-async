import { loadConfig, getApp, getAuth, getDB, callFunction, getStorage, getAnalytics, emulate } from '../src/index.js'
import config from './config.js'

loadConfig(config)
getApp()
test().catch(error => {
  document.getElementById('output').innerHTML = error.message
  console.log(error)
})

async function test () {
  await emulate()
  await getAuth()
  await testFirestore()
  const storage = await getStorage()
  testDimensions(storage)
  await callFunction('test')
  await getAnalytics()
  document.getElementById('output').innerHTML = 'OK'
}

function testDimensions (storage) {
  const tests = [
    {
      params: [{ width: 100, height: 100 }, 10],
      result: { height: 10, width: 10, scaledWidth: 10, scaledHeight: 10 }
    },
    {
      params: [{ width: 100, height: 100 }, null, 10],
      result: { height: 10, width: 10, scaledWidth: 10, scaledHeight: 10 }
    },
    {
      params: [{ width: 1000, height: 1000 }, null, null, 100],
      result: { height: 10, width: 10, scaledWidth: 10, scaledHeight: 10 }
    },
    {
      params: [{ width: 100, height: 100 }, 10, 20, 0],
      result: { height: 10, width: 20, scaledWidth: 20, scaledHeight: 20 }
    },
    {
      params: [{ width: 100, height: 10 }, 10, 10, 0, true],
      result: { height: 10, width: 10, scaledWidth: 10, scaledHeight: 1 }
    },
    {
      params: [{ width: 100, height: 10 }, 100],
      result: { height: 100, width: 1000, scaledWidth: 1000, scaledHeight: 100 }
    }
  ]
  tests.forEach(t => {
    let dimensions = storage.getDimensions(...t.params)
    if (JSON.stringify(dimensions) !== JSON.stringify(t.result)) {
      throw new Error(JSON.stringify(t.params) + ' ' + JSON.stringify(dimensions) + ' !== ' + JSON.stringify(t.result))
    }
  })
}

async function testFirestore () {
  const db = await getDB()

  const testDoc = async () => {
    let doc = await db.get('test', 'test')
    doc.data = { test: 'test' }
    await db.set(doc, 'test')
    await db.update(doc, { test: 'test' })
    await db.del(doc)
    await db.getDocs('test', [db.orderBy('test'), db.where('test', '==', 'test')])
    await db.countDocs('test')
    await db.aggregate({ test: db.sum('test') }, 'test')
  }

  await testDoc()
  await db.loadExtra()
  const unsub = db.onSnapshot(db.getRef('test', 'test'), (doc) => {}, 'test', 'test')
  await testDoc()
  unsub()
}
