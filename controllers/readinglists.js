const { User, Blog, ReadingList } = require('../models')
const { userExtractor } = require('../util/middleware')


const router = require('express').Router()

router.post('/', async (req, res, next) => {
  try {
    const { blogId, userId } = req.body

    if (blogId === undefined || userId === undefined ) {
      return res.status(400).json({
        error: 'Both blogId and useId are required'
      })
    }

    if ( !Number.isInteger(blogId) || blogId < 1 || !Number.isInteger(userId) || userId < 1 ) {
      return res.status(400).json({
        error: 'blogId and userId must be positive integers',
      })
    }

    const user = await User.findByPk(userId)

    if(!user) {
      return res.status(404).json({
        error: `User with id ${userId} not found`
      })
    }

    const blog = await Blog.findByPk(blogId)

    if (!blog) {
      return res.status(404).json({
        error: `Blog with id ${blogId} not found`
      })
    }

    const readingList = await ReadingList.create({
      userId,
      blogId,
    })

    res.status(201).json(readingList)
  } catch(error) {
    next(error)
  }
})

router.put('/:id', userExtractor, async (req, res, next) => {
  try {
    const readingList = await ReadingList.findByPk(req.params.id)

    if(!readingList) {
      return res.status(404).json({
        error: 'Readinglist entry not found'
      })
    }

    if(readingList.userId !== req.decodedToken.id) {
      return res.status(401).json({
        error: 'You can only update your own reading'
      })
    }

    if (typeof req.body.read !== 'boolean') {
      return res.status(400).json({
        error: 'read must be a boolean'
      })
    }

    readingList.read =req.body.read

    await readingList.save()

    res.json(readingList)
  } catch (error) {
    next(error)
  }
})

module.exports = router