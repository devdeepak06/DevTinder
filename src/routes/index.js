const authRouter = require('./auth');
const profileRouter = require('./profile');
const requestRouter = require('./request');
const userRouter = require('./user');
const express = require('express');
const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/profile', profileRouter);
apiRouter.use('/request', requestRouter);
apiRouter.use('/user', userRouter);

module.exports = apiRouter;