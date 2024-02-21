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

  log (eventName, data) {
    logEvent(this.analytics, eventName, data)
  }

  setUserProperties (data) {
    setUserProperties(this.analytics, data)
  }

  setUserId (id) {
    setUserId(this.analytics, id)
  }
}
