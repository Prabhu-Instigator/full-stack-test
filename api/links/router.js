const express = require('express')
const { create, validate } = require('./service')
const linksRouter = express.Router()

linksRouter.post('/generate-link', create);

linksRouter.post('/validate-link', validate);

module.exports = {linksRouter}