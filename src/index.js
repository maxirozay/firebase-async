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

async function load (Lib, libName, appName) {
  const app = getApp(appName)
  if (!app[libName]) {
    app[libName] = new Lib(app.app, config[appName || defaultName][libName])
  }
  return app[libName]
}

export async function getDB (appName) {
  return load((await import('./firestore')).Firestore, 'firestore', appName)
}

export async function getStorage (appName) {
  return load((await import('./storage')).Storage, 'storage', appName)
}

export async function getAuth (appName) {
  return load((await import('./auth')).Auth, 'auth', appName)
}

export async function callFunction (functionName, params, appName) {
  const functions = await load((await import('./functions')).Functions, 'functions', appName)
  return functions.callFunction(functionName, params, appName)
}

export async function getAnalytics (appName) {
  return load((await import('./analytics')).Analytics, 'analytics', appName)
}

export async function emulate (appName) {
  const functions = await load((await import('./functions')).Functions, 'functions', appName)
  const emulator = await import('./emulator')
  emulator.start(functions.functions)
}
