const path = require('path')
const express = require('express')
const xss = require('xss')
const communityBoardsService = require('./boards-service')

const boardsRouter = express.Router()
const jsonParser = express.json()

const serializeCommunityBoards = boards => ({
  id: boards.id,
  user_id: boards.user_id,
  board_title: xss(boards.title),
  likes: boards.likes,
  date_created: boards.date_created,
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
    communityBoardsService.getCommunityBoards(
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
      category_one,
      category_two,
      category_three,
      category_four,
      category_five,
      category_six
    } = req.body
    console.log(req.body)
    const newCommunityBoards = {
      user_id,
      board_title,
      category_one,
      category_two,
      category_three,
      category_four,
      category_five,
      category_six
    }
    for (const [key, value] of Object.entries(newCommunityBoards))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
    CommunityBoardsService.insertCommunityBoards(
      req.app.get('db'),
      newCommunityBoards
    )
      .then(boards => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${boards.id}`))
          .json(serializeCommunityBoards(boards))
      })
      .catch(next)
  })
  .all((req, res, next) => {
    if (isNaN(parseInt(req.params.boards_id))) {
      return res.status(404).json({
        error: { message: `Invalid id` }
      })
    }
    CommunityBoardsService.getCommunityBoards(
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
  .route('/:boards_id')
  .all((req, res, next) => {
   if (isNaN(parseInt(req.params.boards_id))) {
    return res.status(404).json({
      error: {
          message: `Invalid id`
      }
  })
} 
    CommunityBoardsService.getCommunityBoardsById(
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
    res.json(serializeCommunityBoards(res.board))
  })
  .delete((req, res, next) => {
    req.params.board_id,
    console.log(typeof req.params.boards_id)
    CommunityBoardsService.deleteCommunityBoards(req.app.get('db'), req.params.boards_id)
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
    const boardsToUpdate = {
      board_title,
      times_played,
      date_updated
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
    CommunityBoardsService.updateCommunityBoards(
      req.app.get('db'),
      req.params.boards_id,
      boardsToUpdate
    )
      .then(updatedboards => {
        res.status(200).json(serializeCommunityBoards(updatedboards[0]))
      })
      .catch(error => console.log(error))
  })



module.exports = boardsRouter