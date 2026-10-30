require('dotenv').config()
const databaseUrl = process.env.TESTING === 'true' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL
module.exports = {
  
  DATABASE_URL: databaseUrl,
  PORT: process.env.PORT || 3001,
  SECRET: process.env.SECRET
}