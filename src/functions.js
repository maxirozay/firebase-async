import {
  getFunctions,
  httpsCallable
} from 'firebase/functions'

export class Functions {
  constructor (app, config) {
    this.functions = getFunctions(app, config)
  }

  callFunction (name, params) {
    const f = httpsCallable(this.functions, name)
    return f(params)
  }
}
