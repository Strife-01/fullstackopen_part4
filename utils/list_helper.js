const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((likes, currentBlogPost) => {
  return likes + currentBlogPost.likes
  }, 0);
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0){
    return null
  }
  let fav_blog = blogs[0]
  let max_votes = blogs[0].likes
  blogs.forEach(blog => {
    if (max_votes < blog.likes) {
      fav_blog = blog
      max_votes = blog.likes
    }
  });

  return fav_blog
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0){
    return null
  }
  const histogram = {}
  blogs.forEach(blog => {
    let author = blog.author
    histogram[author] = author in histogram ? histogram[author] + 1 : 1
  });

  let max_nr_blogs = 0
  let fav_author = ''

  for (let entry of Object.entries(histogram)) {
    if (max_nr_blogs < entry[1]) {
      max_nr_blogs = entry[1]
      fav_author = entry[0]
    }
  }
  return {author: fav_author, blogs: max_nr_blogs}
}

const mostLikes = (blogs) => {
  if (blogs.length === 0){
    return null
  }
  const histogram = {}
  blogs.forEach(blog => {
    let author = blog.author
    histogram[author] = author in histogram ? histogram[author] + blog.likes : blog.likes
  });

  let max_nr_likes = 0
  let fav_author = ''

  for (let entry of Object.entries(histogram)) {
    if (max_nr_likes < entry[1]) {
      max_nr_likes = entry[1]
      fav_author = entry[0]
    }
  }
  return {author: fav_author, likes: max_nr_likes}
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
} 
