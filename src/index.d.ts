import { FirebaseApp } from 'firebase/app'
import { Firestore } from './firestore.js'
import { Storage } from './storage.js'
import { Auth } from './auth.js'
import { Functions } from './functions.js'
import { Analytics } from './analytics.js'

export interface AppConfig {
  app: any
  recaptchaID?: string
  firestore?: any
  storage?: any
  auth?: any
  functions?: any
  analytics?: any
}

export interface Config {
  [appName: string]: AppConfig
}

export interface AppInstance {
  app: FirebaseApp
  appCheck?: any
  firestore?: Firestore
  storage?: Storage
  auth?: Auth
  functions?: Functions
  analytics?: Analytics
}

export function loadConfig(config: Config): void
export function getApp(appName?: string): AppInstance
export function getDB(full?: boolean, persist?: boolean, appName?: string): Promise<Firestore>
export function getStorage(appName?: string): Promise<Storage>
export function getAuth(appName?: string): Promise<Auth>
export function callFunction(functionName: string, params?: any, options?: any, appName?: string): Promise<any>
export function getAnalytics(appName?: string): Promise<Analytics>
export function emulate(appName?: string): Promise<void>
