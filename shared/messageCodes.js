const messages = {
  info: {
    infAlreadyDownloadedPdf: 'infAlreadyDownloadedPdf'
  },
  message: {},
  error: {
    errEntityAlreadyExist(entityName) {
      return `${entityName}AlreadyExist`
    },
    errEntityDoesNotExist(entityName) {
      return `${entityName}DoesNotExist`
    },
    errOnDbSave: 'errOnDbSave',
    errOnDbFetch: 'errOnDbFetch',
    invalidFields: 'invalidFields',
    missingFields: 'missingFields',
    errNotFound: 'errNotFound',
    errOnPayloadValidation: 'errOnPayloadValidation',
    errEmptyPayload: 'errEmptyPayload',
    errOnAuth: 'errOnAuth',
    errPasswordMismatch: 'errPasswordMismatch',
    errNotAuthorized: 'errNotAuthorized',
    errOnAuthz: 'errOnAuthz',
    errInvalidCatalogFields: 'errInvalidCatalogFields',
    errOnEmailSend: 'errOnEmailSend',
    errCaptchaSrvNoResponse: 'errCaptchaSrvNoResponse'
  },
  layout: {
    ltAbout: 'ltAbout',
    ltTalkUs: 'ltTalkUs',
    ltInstructions: 'ltInstructions',
    ltAuthorData: 'ltAuthorData'
  }
}

module.exports = messages
