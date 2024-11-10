const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')
const config = require('../utils/config.js')
const bcrypt = require('bcrypt')

blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .populate('user')
    .then(blogs => {
      response.json({...blogs, user: request.user})
    })
})

blogsRouter.get('/:id', (request, response, next) => {
  const id = request.params.id

  Blog
    .findById(id)
    .then(blog => {
      if (blog === null) {
        response.status(404).json({error: "Not Found"})
      } else {
        response.status(200).json(blog)
      }
    })
    .catch(error => next(error))
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    if (request.token === undefined) {
      return response.status(401).json({ error: 'token not present' })
    }
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    const blog = new Blog({...request.body, user: user.id})
    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id);
    await user.save()
    response.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', (request, response, next) => {
  const newBody = request.body
  const id = request.params.id

  Blog
    .findByIdAndUpdate(id, newBody, { new: true, runValidators: true })
    .then(result => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: 'Blog not found' });
      }
    })
    .catch(error => next(error));

})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const id = request.params.id;
    const token = request.token;
    if (token === undefined) {
      return response.status(401).json({ error: 'token not present' })
    }
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const blog = await Blog.findById(id)
    if (blog === null) {
      return response.status(404).json({ error: 'blog not found' })
    }
    if (blog.user.toString() !== decodedToken.id) {
      return response.status(401).json({ error: `a blog can be deleted only by the creator ${decodedToken.id} --- ${blog.user}` })
    }
    const deleted = await Blog.findByIdAndDelete(id)
    if (deleted) {
      response.status(204).end()
    } else {
      response.status(404).json({ error: 'blog not found' })
    }
  } catch (error) {
    next(error)
  }
});

module.exports = blogsRouter
