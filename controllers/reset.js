const { Blog, User, Session, ReadingList } = require('../models')

const router = require('express').Router()

router.post('/', async (req, res, next) => {
  try {
    await Session.destroy({
      where: {},
      truncate: true,
      cascade: true
    })

    await ReadingList.destroy({
      where: {},
      truncate: true,
      cascade: true
    })
    
    await Blog.destroy({
      where: {},
      truncate: true,
      cascade: true
    })

    await User.destroy({
      where: {},
      truncate: true,
      cascade: true
    })

    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router