const { validationResult } = require('express-validator')
const { to, ReE, ReS, TE } = require("../services/util.service");

const errorHandler = async (req, res, next) => {
  const resMeta = {}
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    resMeta.statusCode = 400
    // resMeta.status = req.constants.ERROR
    // resMeta.message = errMsg || req.constants.HTTP_SERVER_ERROR
    resMeta.error = errors
    // return res.status(400).json(resMeta);
    return ReE(res, resMeta, 400);
  }
  next()
}

module.exports = {
  errorHandler
}
