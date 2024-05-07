const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("", async (request, response) => {
  const blogs = await Blog.find({}).populate("user");
  // console.log("blogs", blogs);
  response.json(blogs);
});

blogsRouter.post("", async (request, response) => {
  console.log("posting a request");
  const body = request.body;
  // console.log("body", body);
  // const users = await User.find({});
  // console.log("users", users);
  const user = await User.aggregate([{ $sample: { size: 1 } }]);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user[0]._id, // store the user's ID
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
    // console.log("User 0 blogs", user[0].blogs);
    // console.log("saved blog id:", savedBlog._id);
    user[0].blogs = user[0].blogs.concat(savedBlog._id);
    await User.findByIdAndUpdate(user[0]._id, user[0]);
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
