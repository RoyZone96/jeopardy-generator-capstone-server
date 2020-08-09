const path = require('path')
const express = require('express')
const xss = require('xss')
const SupportsService = require('./supports-service')

const supportsRouter = express.Router()
const jsonParser = express.json()

const serializeSupports = supports => ({
    id: supports.id,
    user_id: supports.user_id,
    email: xss(supports.email),
    subject: xss(supports.subject),
    content: xss(supports.content),
    date_added: supports.date_added
})

supportsRouter
    .route('/:supports_id')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        SupportsService.getSupports(knexInstance)
            .then(supports => {
                res.json(supports.map(serializeSupports))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { user_id,
            email,
            subject,
            content,
            date_added } = req.body
        const newSupports = {
            user_id,
            email,
            subject,
            content,
            date_added
        }

        for (const [key, value] of Object.entries(newSupports))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })


        SupportsService.insertSupports(
            req.app.get('db'),
            newSupports
        )
            .then(supports => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${supports.id}`))
                    .json(serializeSupports(supports))
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        console.log(req.params)
        SupportsService.deleteSupports(
            req.app.get('db'),
            req.params.board_id
        )
            .then(numRowsAffected => {
                console.log(numRowsAffected)
                res.status(204).end()
            })
            .catch(err => console.log(err))
    })
    .patch(jsonParser, (req, res, next) => {
        const { user_id,
            email,
            subject,
            content,
            date_added } = req.body
        const supportsToUpdate = {
            user_id,
            email,
            subject,
            content,
            date_added
        }

        const numberOfValues = Object.values(supportsToUpdate).filter(Boolean).length
        if (numberOfValues === 0)
            return res.status(400).json({
                error: {
                    message: `Request body must content either 'title' or 'completed'`
                }
            })
        console.log({
            user_id,
            email,
            subject,
            content,
            date_added
        })
        SupportsService.updateSupports(
            req.app.get('db'),
            req.params.supports_id,
            supportsToUpdate
        )
            .then(updatedsupports => {
                res.status(200).json(serializeSupports(updatedsupports[0]))
            })
            .catch(err => console.log(err))
    })

supportsRouter
    .route('/')
    .all((req, res, next) => {
        if (isNaN(parseInt(req.params.supports_id))) {
            return res.status(404).json({
                error: { message: `Invalid id` }
            })
        }
        SupportsService.getSupportsById(
            req.app.get('db'),
            req.params.supports_id
        )
            .then(supports => {
                if (!supports) {
                    return res.status(404).json({
                        error: { message: `supports doesn't exist` }
                    })
                }
                res.supports = supports
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeSupports(res.supports))
    })
    .delete((req, res, next) => {
        SupportsService.deleteSupports(
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
            email,
            subject,
            content,
            date_added } = req.body
        const supportsToUpdate = {
            user_id,
            email,
            subject,
            content,
            date_added
        }

        const numberOfValues = Object.values(supportsToUpdate).filter(Boolean).length
        if (numberOfValues === 0)
            return res.status(400).json({
                error: {
                    message: `Request body must content either 'title' or 'completed'`
                }
            })

        SupportsService.updatesupports(
            req.app.get('db'),
            req.params.supports_id,
            supportsToUpdate
        )
            .then(updatedsupports => {
                res.status(200).json(serializeSupports(updatedsupports[0]))
            })
            .catch(next)
    })

module.exports = supportsRouter