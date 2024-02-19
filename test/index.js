import { loadConfig, getApp, getAuth, getDB, callFunction, getStorage, getAnalytics, emulate } from '../src/index.js'
import config from './config.js'

loadConfig(config)
getApp()
  .then(async () => {
    await emulate()
    await getAuth()
    await getDB()
    await callFunction('test')
    await getStorage()
    await getAnalytics()
    document.getElementById('output').innerHTML = 'OK'
  })
  .catch(error => {
    document.getElementById('output').innerHTML = error.message
  })