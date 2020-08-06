const path = require('path')
const express = require('express')
const xss = require('xss')
const BoardsService = require('./boards-service')

const boardsRouter = express.Router()
const jsonParser = express.json()

const serializeBoards = boards => ({
  id: boards.id,
  user_id: boards.user_id,
  board_title: xss(boards.title),
  times_played: boards.times_played,
  date_created: boards.date_created,
  date_updated: boards.date_updated
})

boardsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    BoardsService.getBoards(knexInstance)
      .then(boards => {
        res.json(boards.map(serializeBoards))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const {  user_id,
      board_title,
      times_played,
      date_created,
      date_updated  } = req.body
    const newBoards = {  user_id,
      board_title,
      times_played,
      date_created,
      date_updated 
    }

    for (const [key, value] of Object.entries(newBoards))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })


    BoardsService.insertBoards(
      req.app.get('db'),
      newBoards
    )
      .then(boards => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${boards.id}`))
          .json(serializeBoards(boards))
      })
      .catch(next)
  })

boardsRouter
  .route('/:board_id')
  .all((req, res, next) => {
    if(isNaN(parseInt(req.params.board_id))) {
      return res.status(404).json({
        error: { message: `Invalid id` }
      })
    }
    BoardsService.getboardsById(
      req.app.get('db'),
      req.params.board_id
    )
      .then(boards => {
        if (!boards) {
          return res.status(404).json({
            error: { message: `boards doesn't exist` }
          })
        }
        res.boards = boards
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeBoards(res.boards))
  })
  .delete((req, res, next) => {
    BoardsService.deleteboards(
      req.app.get('db'),
      req.params.id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { user_id,
      board_title,
      times_played,
      date_created,
      date_updated  } = req.body
    const boardsToUpdate = { user_id,
      board_title,
      times_played,
      date_created,
      date_updated }

    const numberOfValues = Object.values(boardsToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'title' or 'completed'`
        }
      })

    BoardsService.updateboards(
      req.app.get('db'),
      req.params.boards_id,
      boardsToUpdate
    )
      .then(updatedboards => {
        res.status(200).json(serializeBoards(updatedboards[0]))
      })
      .catch(next)
  })

module.exports = boardsRouter