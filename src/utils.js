const { JWTSECRET } = require('./config.js')
const jwt = require('jsonwebtoken')
const expressJWT = require('express-jwt')


function generateAccessToken(username, role) {
  return jwt.sign(
    { "name": username, "role": role },
    JWTSECRET,
    { expiresIn: "1d" }
  )
}

const jwtMiddleware = expressJWT({ secret: JWTSECRET, algorithms: ['HS256']})

function authMiddleware(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ 'message': err.message })
  }
}

const queryParamFilter = (pair) => !(pair[1] === null || pair[1] === undefined)

function nullFilterMiddleware(req, res, next) {
  req.body = Object.fromEntries(Object.entries(req.body).filter(queryParamFilter))
  next()
}

module.exports = {
  generateAccessToken,
  authMiddleware,
  nullFilterMiddleware,
  queryParamFilter,
  jwtMiddleware
}