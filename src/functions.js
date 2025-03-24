import {
  getFunctions,
  httpsCallable
} from 'firebase/functions'

export class Functions {
  constructor (app, config) {
    this.functions = getFunctions(app, config)
  }

  callFunction (name, params, options) {
    const f = httpsCallable(this.functions, name, options)
    return f(params)
  }
}
