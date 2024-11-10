const usersRouter = require('express').Router()
const User = require('../models/user.js')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({}).populate('blogs')
    response.status(200).json(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.post('/', async (request, response, next) => {
  try {
    const {username, name, password} = request.body

    if (username.length < 3 || password.length < 3) {
      response.status(400).send({error: "password and username must be at least 3 characters long"}).end()
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username: username,
      name: name,
      passwordHash: passwordHash
    })

    const saved_user = await user.save()
    response.status(201).send(saved_user)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
