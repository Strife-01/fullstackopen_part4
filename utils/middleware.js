const logger = require('./logger')
const bcrypt = require('bcrypt')
const config = require('../utils/config.js')
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const tokenExtractor = (request, response, next) => 
{  
  const authorization = request.get('authorization')  
  if (authorization && authorization.startsWith('Bearer ')) {    
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }
  next()
}

// needs to be after tokenExtractor as it is dependent on it to find the user
const userExtractor = async (request, response, next) => {
  try {
    const token = request.token
    if (token === undefined || token === null) {
      request.user = null
    } else {
      const decodedToken = jwt.verify(token, config.SECRET)
      if (!decodedToken.id) {
        request.user = null
      } else {
        request.user = await User.findById(decodedToken.id)
      }
    }
    next()
  } catch (error) {
    next(error)
  }
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}
