require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { CLIENT_ORIGIN } = require('./config')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const errorHandler = require('./middleware/error-handler')
const usersRouter = require('./users/users-router')
const boardsRouter = require('./boards/boards-router')
const questionsRouter = require('./questions/questions-router')
const supportsRouter = require('./supports/supports-router')
const authRouter = require('./auth/auth-router')
const communityBoardsRouter = require('./communityBoards/communityBoards-router')
const path = require('path')


const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption, {
  skip: () => NODE_ENV === 'test',
}))
app.use(cors(
  ({
    // origin: CLIENT_ORIGIN
  })
))
app.use(helmet())

app.use(express.static('public'))

app.use('/api/supports', supportsRouter)
app.use('/api/users', usersRouter)
app.use('/api/boards', boardsRouter)
app.use('/api/questions', questionsRouter)
app.use('/api/auth', authRouter)
app.use('/api/communityBoards', communityBoardsRouter)

app.use(errorHandler)

module.exports = app