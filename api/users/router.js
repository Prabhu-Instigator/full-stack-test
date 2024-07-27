const express = require('express')
const { create, login, authenticate, getTime, kickout } = require('./service')
const userRouter = express.Router()

userRouter.post('/register', create);

userRouter.post('/login', login);

userRouter.post('/get-time', authenticate, getTime);

userRouter.post('/kick-out', authenticate, kickout);

module.exports = {userRouter}