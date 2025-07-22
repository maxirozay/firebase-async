import { FirebaseApp } from 'firebase/app'
import { Analytics as FirebaseAnalytics, CustomParameters } from 'firebase/analytics'

export class Analytics {
  analytics: FirebaseAnalytics

  constructor(app: FirebaseApp)

  log(eventName: string, data?: CustomParameters): void

  setUserProperties(data: CustomParameters): void

  setUserId(id: string): void
}
