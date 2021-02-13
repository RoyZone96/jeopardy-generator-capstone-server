const path = require('path')
const express = require('express')
const xss = require('xss')
const communityBoardsService = require('./communityBoards-service')

const communityBoardsRouter = express.Router()
const jsonParser = express.json()

const serializeCommunityBoards = communityBoards => ({
    id: communityBoards.id,
    user_id: communityBoards.user_id,
    board_title: xss(communityBoards.board_title),
    likes: communityBoards.likes,
    date_created: communityBoards.date_created,
    category_one: xss(communityBoards.category_one),
    category_two: xss(communityBoards.category_two),
    category_three: xss(communityBoards.category_three),
    category_four: xss(communityBoards.category_four),
    category_five: xss(communityBoards.category_five),
    category_six: xss(communityBoards.category_six)
})

communityBoardsRouter
    .route('/')
    .get((req, res, next) => {
        communityBoardsService.getCommunityBoards(
            req.app.get('db')
        )
            .then(communityBoards => {
                res.json(communityBoards)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { 
            id,
            user_id,
            board_title,
            likes,
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
        const newCommunityBoards = {
            id,
            user_id,
            board_title,
            likes,
            category_one,
            category_two,
            category_three,
            category_four,
            category_five,
            category_six,
            date_created: today.toISOString()
        }
        for (const [key, value] of Object.entries(newCommunityBoards))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
        communityBoardsService.insertCommunityBoards(
            req.app.get('db'),
            newCommunityBoards
        )
            .then(communityBoards => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${communityBoards.id}`))
                    .json(serializeCommunityBoards(communityBoards))
            })
            .catch(next)
    })
    

communityBoardsRouter
    .route('/:communityBoards_id')
    .all((req, res, next) => {
        if (isNaN(parseInt(req.params.communityBoards_id))) {
            return res.status(404).json({
                error: { message: `Invalid id` }
            })
        }
        communityBoardsService. getCommunityBoardsById(
            req.app.get('db'),
            req.params.communityBoards_id
        )
            .then(communityBoards => {
                if (!communityBoards) {
                    return res.status(404).json({
                        error: { message: `communityBoards doesn't exist` }
                    })
                }
                res.communityBoards = communityBoards
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeCommunityBoards(res.communityBoards))
    })
    .delete((req, res, next) => {
        req.params.communityBoards_id,
            console.log(typeof req.params.communityBoards_id)
        communityBoardsService.deleteCommunityBoards(req.app.get('db'), req.params.communityBoards_id)
            .then(numRowsAffected => {
                console.log(numRowsAffected)
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const {
           likes
        } = req.body
        const communityBoardsToUpdate = {
            likes
        }
        communityBoardsService.updateCommunityBoards(
            req.app.get('db'),
            req.params.communityBoards_id,
            communityBoardsToUpdate
        )
            .then(updatedcommunityBoards => {
                res.status(200).json(serializeCommunityBoards(updatedcommunityBoards[0]))
            })
            .catch(error => console.log(error))
    })



module.exports = communityBoardsRouter