import { FirebaseApp } from 'firebase/app'
import { Auth as FirebaseAuth, User, Unsubscribe } from 'firebase/auth'

export interface AuthStateChangeCallback {
  (user: User | null): void
}

export class Auth {
  auth: FirebaseAuth

  constructor(app: FirebaseApp)

  onAuthStateChanged(callback: AuthStateChangeCallback): Unsubscribe

  signOut(): Promise<void>

  emailLink(): Promise<any>

  anonymous(): Promise<any>
}
