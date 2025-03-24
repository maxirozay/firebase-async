const { onCall } = require('firebase-functions/v2/https')

exports.test = onCall({
  enforceAppCheck: true
}, (request) => {})
