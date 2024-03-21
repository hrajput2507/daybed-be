require('dotenv').config()

module.exports = {
  "db" : {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT,
    "port": process.env.DB_PORT,
    "dialectOptions": {
      // "ssl": {
      //   "require": true, // This will help you. But you will see nwe error
      //   "rejectUnauthorized": false // This line will fix new error
      // }
    },
  },
  "logging": {
    "log_days": process.env.LOG_DAYS,
    "level": process.env.LOG_LEVEL,
    "path": process.env.LOG_PATH,
  },
  "redis": {
    "host": process.env.REDIS_HOST || 'localhost',
    "port": process.env.REDIS_PORT || '6739'
  }
}