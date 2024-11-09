const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
})

describe('favorite blog', () => {
  const blogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    }
  ]

  test('when there are multiple blogs in the array', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, blogs[1])
  })
})

describe('most active author', () => {
  const blogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    },
    {
      title: "Canonical string reduction 2",
      author: "Edsger W. Dijkstra",
      likes: 3
    },
    {
      _id: '5a422aa71b54a676234d17asdff8',
      title: 'Go To Statement asdfConsidered Harmful',
      author: 'Robert C. Martin',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      title: "Canonical string reduction 12",
      author: "Robert C. Martin",
      likes: 3
    }
  ]

  const answer = {
    author: "Edsger W. Dijkstra",
    blogs: 3
  }

  test('when there are multiple blogs in the array who has the most', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, answer)
  })
})

describe('favorite author', () => {
  const blogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    },
    {
      title: "Canonical string reduction 2",
      author: "Edsger W. Dijkstra",
      likes: 3
    },
    {
      _id: '5a422aa71b54a676234d17asdff8',
      title: 'Go To Statement asdfConsidered Harmful',
      author: 'Robert C. Martin',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      title: "Canonical string reduction 12",
      author: "Robert C. Martin",
      likes: 3
    }
  ]

  const answer = {
    author: "Edsger W. Dijkstra",
    likes: 20
  }

  test('when there are multiple blogs in the array who has the most', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, answer)
  })
})

