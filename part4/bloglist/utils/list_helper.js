const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => acc + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  const favoriteBlog = blogs.reduce((prev, current) =>
    prev.likes > current.likes ? prev : current
  );
  delete favoriteBlog._id;
  delete favoriteBlog.__v;
  return favoriteBlog;
};

const mostBlogs = (blogs) => {
  const authorsBlogCount = {};
  for (let blog of blogs) {
    if (authorsBlogCount[blog.author]) {
      authorsBlogCount[blog.author] += 1;
    } else {
      authorsBlogCount[blog.author] = 1;
    }
  }

  const authorsArray = Object.entries(authorsBlogCount);
  //   console.log("AuthorsArray", authorsArray);
  const authorWithMostBlogs = authorsArray.sort((a, b) => b[1] - a[1])[0];

  return {
    author: authorWithMostBlogs[0],
    blogs: authorWithMostBlogs[1],
  };
};

const mostLikes = (blogs) => {
  const authorsLikeCount = {};
  for (let blog of blogs) {
    if (authorsLikeCount[blog.author]) {
      authorsLikeCount[blog.author] += blog.likes;
    } else {
      authorsLikeCount[blog.author] = blog.likes;
    }
  }

  const authorsArray = Object.entries(authorsLikeCount);
  //   console.log("AuthorsArray", authorsArray);
  const authorWithMostLikes = authorsArray.sort((a, b) => b[1] - a[1])[0];

  return {
    author: authorWithMostLikes[0],
    likes: authorWithMostLikes[1],
  };
};
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
