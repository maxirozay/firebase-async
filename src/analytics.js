import {
  getAnalytics,
  logEvent,
  setUserProperties,
  setUserId
} from 'firebase/analytics'

export class Analytics {
  constructor (app) {
    this.analytics = getAnalytics(app)
  }

  log (data) {
    logEvent(this.analytics, data)
  }

  setUserProperties (data) {
    setUserProperties(this.analytics, data)
  }

  setUserId (id) {
    setUserId(this.analytics, id)
  }
}
