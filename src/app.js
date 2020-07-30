require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const errorHandler = require('./middleware/error-handler')
const todoRouter = require('./todo/todo-router')
const usersRouter = require('./users/users-router')
const boardsRouter = require('./boards/boards-router')
const questionsRouter = require('./questions/questions-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption, {
  skip: () => NODE_ENV === 'test',
}))
app.use(cors())
app.use(helmet())

app.use(express.static('public'))

app.use('/v1/todos', todoRouter)
app.use('/api/users', usersRouter)
app.use('/api/boards', boardsRouter)
app.use('/api/questions', questionsRouter)
app.use(errorHandler)

module.exports = app