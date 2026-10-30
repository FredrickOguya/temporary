const router = require('express').Router()
const bcrypt = require('bcrypt')

const { User, Blog } = require('../models')


router.post('/', async (req, res, next) => {
  try {
    const body = req.body

    const passwordHash = await bcrypt.hash(body.password, 10)

    const user = await User.create({
      username: body.username,
      name: body.name,
      password: passwordHash
    })
    res.json(user)
  } catch (error) {
    next(error)
  }
})


router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['password']
      },
      include: {
        model: Blog,
        as: 'authoredBlogs',
      },
    })

    const usersWithBlogs = users.map(user => {
      const userData = user.toJSON()

      userData.blogs = userData.authoredBlogs
      delete userData.authoredBlogs

      return userData
    })

    res.json(usersWithBlogs)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {

    const read = req.query.read

    const throughOptions = {
      attributes: ['id', 'read'],
    }

    if (read === 'true' || read === 'false') {
      throughOptions.where = {
        read: read === 'true',
      }
    }
    const user = await User.findByPk(req.params.id, {
      attributes: {
        exclude: ['password'],
      },
      include: {
        model: Blog,
        as: 'readingList',
        attributes: [
          'id',
          'url',
          'title',
          'author',
          'likes',
          'year',
        ],
        through: throughOptions,
      },
    })

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      })
    }

    const userData = user.toJSON()

    userData.readings = userData.readingList.map(blog => {
      const { reading_list, ...blogData } = blog

      return {
        ...blogData,
        readingList: reading_list
      }
    })
    delete userData.readingList

    res.json(userData)
  } catch (error) {
    next(error)
  }
})


router.put('/:username', async (req, res) => {
  const updates = req.body;
  
  try {
    const user = await User.findOne({where : {username: req.params.username }})
    if (!user) {
      return res.status(404).json({ error: 'User not found'})
    }

    await User.update(req.body, {where: {username: req.params.username}})
    
    const updatedUser = await User.findOne({where: {username: req.params.username}})

    res.json(updatedUser)
  }catch(error) {
    console.log(error.message)
  }
})

module.exports = router