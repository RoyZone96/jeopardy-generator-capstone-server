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
  date_updated: boards.date_updated,
  category_one: xss(boards.category_one),
  category_two: xss(boards.category_two),
  category_three: xss(boards.category_three),
  category_four: xss(boards.category_four),
  category_five: xss(boards.category_five),
  category_six: xss(boards.category_six)
})

boardsRouter
  .route('/')
  .get((req, res, next) => {
    BoardsService.getBoards(
      req.app.get('db')
    )
      .then(boards => {
        res.json(boards)
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { user_id,
      board_title,
      times_played,
      category_one,
      category_two,
      category_three,
      category_four,
      category_five,
      category_six
    } = req.body
    console.log(req.body)
    //get the current date in unix format 
    const timeElapsed = Date.now();
    //conver the unix format date into string
    const today = new Date(timeElapsed);
    const newBoards = {
      user_id,
      board_title,
      times_played,
      date_created: today.toISOString(),
      category_one,
      category_two,
      category_three,
      category_four,
      category_five,
      category_six
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
  .all((req, res, next) => {
    if (isNaN(parseInt(req.params.boards_id))) {
      return res.status(404).json({
        error: { message: `Invalid id` }
      })
    }
    BoardsService.getBoards(
      req.app.get('db'),
      req.params.boards_id
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

  boardsRouter
  .route('/sort-by/names')
  .get((req, res, next) => {
    BoardsService.getSortedBoardsByNames(
      req.app.get('db')
    )
      .then(boards => {
        res.json(boards)
      })
      .catch(next)
  })
  
  boardsRouter
  .route('/sort-by/dates')
  .get((req, res, next) => {
    BoardsService. getSortedBoardsByDate(
      req.app.get('db')
    )
      .then(boards => {
        res.json(boards)
      })
      .catch(next)
  })

boardsRouter
  .route('/:boards_id')
  .all((req, res, next) => {
    if (isNaN(parseInt(req.params.boards_id))) {
      return res.status(404).json({
        error: {
          message: `Invalid id`
        }
      })
    }
    BoardsService.getBoardsById(
      req.app.get('db'),
      req.params.boards_id
    )
      .then(board => {
        if (!board) {
          return res.status(404).json({
            error: { message: `board doesn't exist` }
          })
        }
        res.board = board
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(res.board)
  })
  .delete((req, res, next) => {
    req.params.board_id,
      console.log(typeof req.params.boards_id)
    BoardsService.deleteBoards(req.app.get('db'), req.params.boards_id)
      .then(numRowsAffected => {
        console.log(numRowsAffected)
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const {
      board_title,
      times_played,
      date_updated
    } = req.body
    //get the current date in unix format 
    const timeElapsed = Date.now();
    //conver the unix format date into string
    const today = new Date(timeElapsed);
    const boardsToUpdate = {
      board_title,
      times_played,
      date_updated: today.toISOString()
    }

    const numberOfValues = Object.values(boardsToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'title' or 'completed'`
        }
      })
    console.log({
      user_id,
      board_title,
      times_played,
      date_created,
      date_updated
    })
    BoardsService.updateBoards(
      req.app.get('db'),
      req.params.boards_id,
      boardsToUpdate
    )
      .then(updatedboards => {
        res.status(200).json(serializeBoards(updatedboards[0]))
      })
      .catch(error => console.log(error))
  })


module.exports = boardsRouter