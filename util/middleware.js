
const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const { User, Session } = require('../models')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7)
  } else {
    req.token = null
  }

  next()
}

const userExtractor = async (req, res, next) => {
  let decodedToken

  // First, verify the JWT
  try {
    decodedToken = jwt.verify(req.token, SECRET)
  } catch (error) {
    return res.status(401).json({
      error: 'token missing or invalid'
    })
  }

  if (!decodedToken.id) {
    return res.status(401).json({
      error: 'token invalid'
    })
  }

  // Next, check whether the session still exists
  try {
    const session = await Session.findOne({
      where: { token: req.token },
      include: {
        model: User,
        as: 'user'
      }
    })

    if (!session || !session.user || session.user.disabled) {
      return res.status(401).json({
        error: 'session invalid or user disabled'
      })
    }

    req.decodedToken = decodedToken
    req.user = session.user

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = { tokenExtractor, userExtractor }
