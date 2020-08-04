const path = require('path')
const express = require('express')
const xss = require('xss')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonParser = express.json()

const serializeUser = users => ({
  id: users.id,
  username: xss(users.username),
  password: xss(users.password),
  email: users.email,
  log_state: users.log_state
})

usersRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    UsersService.getUsers(knexInstance)
      .then(users => {
        res.json(users.map(serializeUser))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const {  email,
      username,
      password,
      log_state} = req.body
    const newUser = {  email,
      username,
      password,
      log_state}

    for (const [key, value] of Object.entries(newUser))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })


    UsersService.insertUsers(
      req.app.get('db'),
      newUser
    )
      .then(user => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${user.id}`))
          .json(serializeUser(user))
      })
      .catch(next)
  })

usersRouter
  .route('/')
  .all((req, res, next) => {
    if(isNaN(parseInt(req.params.user_id))) {
      return res.status(404).json({
        error: { message: `Invalid id` }
      })
    }
    UsersService.getUserById(
      req.app.get('db'),
      req.params.user_id
    )
      .then(user => {
        if (!user) {
          return res.status(404).json({
            error: { message: `User doesn't exist` }
          })
        }
        res.user = user
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeUser(res.user))
  })
  .delete((req, res, next) => {
    UsersService.deleteUser(
      req.app.get('db'),
      req.params.user_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { title, completed } = req.body
    const userToUpdate = { title, completed }

    const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'title' or 'completed'`
        }
      })

    UsersService.updateUser(
      req.app.get('db'),
      req.params.user_id,
      userToUpdate
    )
      .then(updatedUser => {
        res.status(200).json(serializeUser(updatedUser[0]))
      })
      .catch(next)
  })

module.exports = usersRouter