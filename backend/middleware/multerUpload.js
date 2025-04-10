const { sendResponse } = require('../common/response')

const makeMulterUploadMiddleware = (multerUploadFunction) => {
  return (req, res, next) =>
    multerUploadFunction(req, res, err => {
      const resMeta = {}
      // handle Multer error
      if (err && err.name && err.name === 'MulterError') {
        resMeta.statusCode = req.constants.HTTP_UNPROCESSABLE_ENTITY_ERROR
        resMeta.status = req.constants.ERROR
        resMeta.message = err.message ? `File upload error: ${err.message}` : req.constants.HTTP_SERVER_ERROR
        resMeta.error = err.name

        return sendResponse(req, res, resMeta)
      }

      // handle other errors
      if (err) {
        resMeta.statusCode = req.constants.HTTP_SERVER_ERROR
        resMeta.status = req.constants.ERROR
        resMeta.message = 'Something wrong ocurred when trying to upload the file'
        resMeta.error = 'FILE UPLOAD ERROR'

        return sendResponse(req, res, resMeta)
      }
      next()
    })
}

module.exports = {
  makeMulterUploadMiddleware
}