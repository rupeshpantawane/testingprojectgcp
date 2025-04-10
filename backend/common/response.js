/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const prepareResponse = (req, res, resMeta) => {
  const status = (resMeta.status != undefined) ? resMeta.status : false
  const message = resMeta.message ? resMeta.message : 'Somthing went wrong. Please try again.'
  const data = resMeta.data ? resMeta.data : []
  const addressInfo = resMeta.addressInfo ? resMeta.addressInfo : null
  const isSocialLoign = resMeta.isSocialLoign ? resMeta.isSocialLoign : null
  const statusCode = resMeta.statusCode ? resMeta.statusCode : 400
  const error = resMeta.error ? resMeta.error.stack : {}

  if (statusCode == 500 || statusCode == 501 || statusCode == 502 || statusCode == 503 || statusCode == 504 || statusCode == 505) {
 
    return res.status(statusCode).json({
      code: statusCode,
      status,
      message,
      error
    })
  } else {
    const resp = {
      code: statusCode,
      status,
      message,
      result: data
    }

    if (addressInfo) {
      resp.addressInfo = addressInfo
    }

    if (isSocialLoign && isSocialLoign == 0) {
      resp.isSocialLoign = isSocialLoign || false
    }

    if (resMeta.alreadyRegister) {
      resp.alreadyRegister = true
    }

    res.status(statusCode).json(resp)

  }
}

module.exports = {
  sendResponse: prepareResponse
}
