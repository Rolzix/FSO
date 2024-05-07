const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogsRouter.get("", async (request, response) => {
  const blogs = await Blog.find({}).populate("user");
  // console.log("blogs", blogs);
  response.json(blogs);
});

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

blogsRouter.post("", async (request, response) => {
  console.log("posting a request");
  const body = request.body;
  // console.log("body", body);
  // const users = await User.find({});
  // console.log("users", users);
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  console.log(decodedToken);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);
  // const user = await User.aggregate([{ $sample: { size: 1 } }]);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user, // store the user's ID
  });
  // console.log("blog", blog);
  // const user = await User.findById(body.userId);
  // console.log("user", user);
  blog.likes = request.body.likes || 0;
  if (user === null) {
    console.log("User not found");
    return response.status(400).json({ error: "User not found" });
  }
  if (!blog.title || !blog.url) {
    return response.status(400).json({ error: "Title and URL are required" });
  } else {
    const savedBlog = await blog.save();
    // console.log("saved blog", savedBlog);
    // const populatedBlog = await Blog.findById(savedBlog._id).populate("user");
    // console.log("populatedBlog", populatedBlog);
    // console.log("User 0 blogs", user.blogs);
    // console.log("saved blog id:", savedBlog._id);
    user.blogs = user.blogs.concat(savedBlog._id);
    await User.findByIdAndUpdate(user._id, user);
    response.status(201).json(savedBlog);
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findOneAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const updatedBlog = request.body;
  const result = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {
    new: true,
  });
  response.json(result);
});

module.exports = blogsRouter;
