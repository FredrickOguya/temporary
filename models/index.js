const Blog = require('./blog')
const ReadingList = require('./readingList')
const Session = require('./sessions')
const User = require('./user')

User.hasMany(Blog, {
  as: 'authoredBlogs'
})
Blog.belongsTo(User, {
  as: 'user'
})

User.belongsToMany(Blog, {
  through: ReadingList,
  as: 'readingList',
})
Blog.belongsToMany(User, {
  through: ReadingList,
  as: 'readers'
})

User.hasMany(Session, { as: 'session' })
Session.belongsTo(User, { as: 'user' })

module.exports = {
  Blog, 
  User,
  ReadingList,
  Session
}