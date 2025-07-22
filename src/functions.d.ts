import { FirebaseApp } from 'firebase/app'
import { Functions as FirebaseFunctions, HttpsCallableOptions } from 'firebase/functions'

export interface FunctionsConfig {
  region?: string
  [key: string]: any
}

export class Functions {
  functions: FirebaseFunctions

  constructor(app: FirebaseApp, config?: FunctionsConfig)

  callFunction(
    name: string,
    params?: any,
    options?: HttpsCallableOptions
  ): Promise<any>
}
