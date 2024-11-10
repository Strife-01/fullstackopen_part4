const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog.js')
const helper = require('../utils/helper.js')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let note of helper.initialBlogs) {
    let noteObject = new Blog(note)
    await noteObject.save()
  }
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blogs contain id as unique identifier', async () => {
  await api
    .get('/api/blogs')
    .expect(hasIdAsKey)

  function hasIdAsKey(res){
    res.body.forEach(blog => {
      if (!('id' in blog)){
        throw new Error('id key is missing');
      }
    });
  }
})

test('blogs post works as expected', async () => {
  testInsert = {
    title: "Deep Learning",
    author: "Ian Goodfellow",
    url: "https://example.com/deep-learning",
    likes: 50
  }

  await api
    .post('/api/blogs')
    .send(testInsert)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(201)
  
  await api
    .get('/api/blogs')
    .expect((res) => (res.length + 1) === (helper.initialBlogs.length + 1))
})

test('default likes set to 0', async () => {
  testInsert = {
    title: "The Elements of Statistical Learning",
    author: "Trevor Hastie",
    url: "https://example.com/elements-of-statistical-learning",
  }

  function defaultsLikesToZero(res) {
    for (r of res._body) {
      if (r.title === testInsert.title && r.author === testInsert.author && r.url === testInsert.url){
        if (!(r.likes === 0)){
          throw new Error(`the backend doesn't auto populate likes to 0 when missing`);
        }
      }
    }
  }

  await api
    .post('/api/blogs')
    .send(testInsert)
    .set('Accept', 'application/json')
  
  await api
    .get('/api/blogs')
    .expect(defaultsLikesToZero)
})

test('backend returns 400 if no url of no title', async () => {
  testInsert = [
    {
      author: "Roberto Ierusalimschy",
      likes: 17
    },
    {
      author: "Gerald Jay Sussman",
      url: "https://example.com/sicp",
      likes: 33
    },
    {
      title: "Introduction to the Theory of Computation",
      author: "Michael Sipser",
      likes: 20
    }
  ]

  await api
    .post('/api/blogs')
    .send(testInsert[0])
    .expect(400)

  await api
    .post('/api/blogs')
    .send(testInsert[1])
    .expect(400)

  await api
    .post('/api/blogs')
    .send(testInsert[2])
    .expect(400)
})

test('check for deletion of blog', async () => {
  const testInsert = {
    title: "Algorithms Unlocked",
    author: "Thomas H. Cormen",
    url: "https://example.com/algorithms-unlocked",
    likes: 14
  }

  let id = null
  function extractId(res) {
    for (r of res._body){
      if (r.title === testInsert.title && r.author === testInsert.author && r.url === testInsert.url){
        id = r.id
        return true
      }
    }
  }

  await api
    .post('/api/blogs')
    .send(testInsert)
    .expect(201)

  await api
    .get('/api/blogs')
    .expect(extractId)

  await api
    .delete(`/api/blogs/${id}`)
    .expect(204)

  await api
    .get(`/api/blogs/${id}`)
    .expect(404)
})

test('check for update of nr or likes on a blog', async () => {
  testInsert = {
    title: "Programming Pearls",
    author: "Jon Bentley",
    url: "https://example.com/programming-pearls",
    likes: 22
  }
  const new_nr_of_likes = { likes: 23 }

  let id = null
  function extractId(res) {
    for (r of res._body){
      if (r.title === testInsert.title && r.author === testInsert.author && r.url === testInsert.url){
        id = r.id
        return true
      }
    }
    throw new Error(`id is not in db`)
  }

  function checkNrLikes(res) {
    if (res !== null){
      if (!(res._body.likes === new_nr_of_likes.likes)){
        throw new Error(`the number of likes is ${res._body.likes} and it should be ${new_nr_of_likes.likes}`)
      } else {
        return true
      }
    }
    throw new Error('the id is not in the database')
  }

  await api
    .get('/api/blogs')
    .expect(extractId)

  await api
    .put(`/api/blogs/${id}`)
    .send(new_nr_of_likes)
    .set('Accept', 'application/json')
    .expect(204)

  await api
    .get(`/api/blogs/${id}`)
    .expect(checkNrLikes)
})

after(async () => {
  await mongoose.connection.close()
})

test.only('blogs post works as expected - error when not authenticated', async () => {
  testInsert = {
    title: "Deep Learning",
    author: "Ian Goodfellow",
    url: "https://example.com/deep-learning",
    likes: 50
  }

  await api
    .post('/api/blogs')
    .send(testInsert)
    .set('Accept', 'application/json')
    .expect(401)
})


