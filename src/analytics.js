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

  async log (data) {
    logEvent(this.analytics, data)
  }

  async setUserProperties (data) {
    setUserProperties(this.analytics, data)
  }

  async setUserId (id) {
    setUserId(this.analytics, id)
  }
}
