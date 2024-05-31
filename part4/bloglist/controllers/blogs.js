const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
blogsRouter.get("", async (request, response) => {
  const blogs = await Blog.find({}).populate("user");
  response.json(blogs);
});
blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate("user");
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
  // const blogs = await Blog.find({}).populate("user");
});
blogsRouter.post("", async (request, response) => {
  const body = request.body;
  // const users = await User.find({});
  if (!request.token) {
    return response.status(401).json({ error: "token missing" });
  }
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  // const user = await User.findById(decodedToken.id);
  const user = request.user;
  // get randomized user
  // const user = await User.aggregate([{ $sample: { size: 1 } }]);
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user, // store the user's ID
  });
  // const user = await User.findById(body.userId);
  blog.likes = request.body.likes || 0;
  if (user === null) {
    return response.status(400).json({ error: "User not found" });
  }
  if (!blog.title || !blog.url) {
    return response.status(400).json({ error: "Title and URL are required" });
  } else {
    const savedBlog = await blog.save();
    // const populatedBlog = await Blog.findById(savedBlog._id).populate("user");
    user.blogs = user.blogs.concat(savedBlog._id);
    await User.findByIdAndUpdate(user._id, user);
    response.status(201).json(savedBlog);
  }
});
blogsRouter.delete("/:id", async (request, response) => {
  if (!request.token) {
    return response
      .status(401)
      .json({ error: "No authorization token provided" });
  }
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);
  const blog = await Blog.findById(request.params.id);
  if (blog.user.toString() !== user._id.toString()) {
    return response
      .status(401)
      .json({ error: "You can only delete your own blogs" });
  } else {
    await Blog.findOneAndDelete({ _id: request.params.id });
    await User.findByIdAndUpdate(user._id, {
      $pull: { blogs: request.params.id },
    });
    response.status(200).json({ message: "Blog deleted" });
  }
});
blogsRouter.put("/:id", async (request, response) => {
  console.log("[Debug] request.params.id: ", request.params.id);
  console.log("[Debug] request.body: ", request.body);
  const updatedBlog = request.body;
  console.log("[Debug] updatedBlog: ", updatedBlog);
  const result = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {
    new: true,
  });
  response.json(result);
  response.status(200).end();
});
module.exports = blogsRouter;
