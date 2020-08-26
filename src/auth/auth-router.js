const express = require('express')
const AuthService = require('./auth-service')
const { requireAuth } = require('../middleware/jwt-auth.js')

const authRouter = express.Router()
const jsonBodyParser = express.json()

authRouter
  .post('/login', jsonBodyParser, (req, res, next) => {
    const { username, password } = req.body
    const loginUser = { username, password }
    console.log(loginUser)
    for (const [key, value] of Object.entries(loginUser)) {
      console.log(value)
      if (value == null) {
        console.log('demo')
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
      }
    }


    AuthService.getUserWithUserName(
      req.app.get('db'),
      loginUser.username
    )
      .then(dbUser => {
        console.log(dbUser)
        if (!dbUser) {
          return res.status(400).json({
            error: 'Incorrect username or password',
          })
        }

        return AuthService.comparePasswords(loginUser.password, dbUser.password)
          .then(compareMatch => {
            console.log(compareMatch)
            if (!compareMatch) {
              return res.status(400).json({
                error: 'Incorrect username or password',
              })
            }
            const sub = dbUser.username
            const payload = { user_id: dbUser.id }
            res.send({
              authToken: AuthService.createJwt(sub, payload),
              user_id: dbUser.id
            })
          })
      })
      .catch(next)
  })

authRouter.post('/refresh', requireAuth, (req, res) => {
  const sub = req.user.username
  const payload = { user_id: req.user.id }
  res.send({
    authToken: AuthService.createJwt(sub, payload),
  })
})

module.exports = authRouter