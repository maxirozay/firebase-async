import { initializeApp } from 'firebase/app'

const apps = {}
const defaultName = '[DEFAULT]'
let config

export function loadConfig (c) {
  config = c
}

export function getApp (appName = defaultName) {
  if (apps[appName]) return apps[appName]
  apps[appName] = {
    app: initializeApp(config[appName].app, appName)
  }
  return apps[appName]
}

async function load (Lib, libName, appName = defaultName) {
  const app = getApp(appName)
  if (!app[libName]) {
    if (config[appName].recaptchaID && !app.appCheck) {
      const { initializeAppCheck, ReCaptchaEnterpriseProvider } = await import('./appCheck.js')
      app.appCheck = initializeAppCheck(app.app, {
        provider: new ReCaptchaEnterpriseProvider(config[appName].recaptchaID),
        isTokenAutoRefreshEnabled: true
      })
    }
    app[libName] = new Lib(app.app, config[appName || defaultName][libName])
  }
  return app[libName]
}

export async function getDB (full, persist, appName) {
  const db = await load((await import('./firestore.js')).Firestore, 'firestore', appName)
  await db.loadSDK(!!full, !!persist)
  return db
}

export async function getStorage (appName) {
  return load((await import('./storage.js')).Storage, 'storage', appName)
}

export async function getAuth (appName) {
  return load((await import('./auth.js')).Auth, 'auth', appName)
}

export async function callFunction (functionName, params, options, appName) {
  const functions = await load((await import('./functions.js')).Functions, 'functions', appName)
  return functions.callFunction(functionName, params, options)
}

export async function getAnalytics (appName) {
  return load((await import('./analytics.js')).Analytics, 'analytics', appName)
}

export async function emulate (appName) {
  const functions = await load((await import('./functions.js')).Functions, 'functions', appName)
  const emulator = await import('./emulator.js')
  emulator.start(functions.functions)
}
