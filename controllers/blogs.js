const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')

blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
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

blogsRouter.post('/', (request, response, next) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => next(error));
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

blogsRouter.delete('/:id', (request, response, next) => {
  const id = request.params.id;

  Blog
    .findByIdAndDelete(id)
    .then(result => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: 'Blog not found' });
      }
    })
    .catch(error => next(error));
});

module.exports = blogsRouter
