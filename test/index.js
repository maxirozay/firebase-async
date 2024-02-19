import { loadConfig, getApp, getAuth, getDB, callFunction, getStorage } from '../src/index.js'
import config from './config.js'

loadConfig(config)
getApp()
  .then(async () => {
    await getAuth()
    await getDB()
    await callFunction().catch(() => {})
    await getStorage()
    document.getElementById('output').innerHTML = 'OK'
  })
  .catch(error => {
    document.getElementById('output').innerHTML = error.message
  })