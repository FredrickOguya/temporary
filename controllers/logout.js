const { Session } = require('../models')
const { userExtractor } = require('../util/middleware')

const router = require('express').Router()

router.delete('/', userExtractor, async (req, res, next) => {
  try {
    await Session.destroy({
      where: {
        token: req.token
      }
    })

    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router