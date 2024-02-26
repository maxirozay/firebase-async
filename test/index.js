import { loadConfig, getApp, getAuth, getDB, callFunction, getStorage, getAnalytics, emulate } from '../src/index.js'
import config from './config.js'

loadConfig(config)
getApp()
  .then(async () => {
    await emulate()
    await getAuth()
    await getDB()
    const storage = await getStorage()
    testDimensions(storage)
    await callFunction('test')
    await getAnalytics()
    document.getElementById('output').innerHTML = 'OK'
  })
  .catch(error => {
    document.getElementById('output').innerHTML = error.message
  })

function testDimensions (storage) {
  const tests = [
    {
      params: [{ width: 100, height: 100 }, 10, 0, 0],
      result: {  height: 10, width: 10, scaledWidth: 10, scaledHeight: 10 }
    },
    {
      params: [{ width: 100, height: 100 }, 0, 10, 0],
      result: {  height: 10, width: 10, scaledWidth: 10, scaledHeight: 10 }
    },
    {
      params: [{ width: 1000, height: 1000 }, 0, 0, 100],
      result: {  height: 10, width: 10, scaledWidth: 10, scaledHeight: 10 }
    },
    {
      params: [{ width: 100, height: 100 }, 10, 20, 0],
      result: {  height: 10, width: 20, scaledWidth: 20, scaledHeight: 20 }
    },
  ]
  tests.forEach(t => {
    let dimensions = storage.getDimensions(...t.params)
    if (JSON.stringify(dimensions) !== JSON.stringify(t.result)) {
      throw new Error(JSON.stringify(dimensions) + ' !== ' + JSON.stringify(t.result))
    }
  })
}
