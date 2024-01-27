import {
  getAuth,
  onAuthStateChanged,
  signOut
} from 'firebase/auth'

export class Auth {
  constructor (app) {
    this.auth = getAuth(app)
  }

  onAuthStateChanged (callback) {
    return onAuthStateChanged(this.auth, callback)
  }

  signOut () {
    return signOut(this.auth)
  }

  emailLink () {
    return import('./authProviders/link')
  }

  anonymous () {
    return import('./authProviders/anonymous')
  }
}
