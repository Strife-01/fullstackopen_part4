const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user.js')
const config = require('../utils/config.js')

loginRouter.post('/', async (request, response, next) => {
  const {username, password} = request.body

  // check for user in db
  const user = await User.findOne({ username })

  // check for password
  const correctPass = user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && correctPass)) {
    response.status(401).json({error:"invalid username or password"})
  }

  const userForToken = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(userForToken, config.SECRET)

  response.status(200).send({token, username: user.username, name: user.name})
})

module.exports = loginRouter
