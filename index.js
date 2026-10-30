
require('dotenv').config()

const express = require('express')
const app = express()
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const resetRouter = require('./controllers/reset')
const readinglistsRouter = require('./controllers/readinglists')
const logoutRouter = require('./controllers/logout')

const { tokenExtractor } = require('./util/middleware')

const { sequelize, connectToDatabase, migrator } = require('./util/db')

const { Blog, syncModels } = require('./models')

app.use(express.json())
app.use(tokenExtractor)

app.get('/', (req, res) => {
  res.status(200).send('OK')
})
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/reset', resetRouter)
app.use('/api/readinglists', readinglistsRouter)
app.use('/api/logout', logoutRouter)


const PORT = process.env.PORT || 3001

app.use((error, req, res, next) => {
  if(error.name === 'SequelizeValidationError' ||
     error.name === 'SequelizeUniqueConstraintError'
  ) {
    return res.status(400).json({
      error: error.errors.map(e => e.message)
    })
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: error.errors.map(e => e.message)
    })
  }

  next(error)
})

const start = async () => {
  await connectToDatabase()
  await migrator.up()
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}
start()
