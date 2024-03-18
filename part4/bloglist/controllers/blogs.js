const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("", async (request, response) => {
  const blogs = await Blog.find({});
  // console.log("blogs", blogs);
  response.json(blogs);
});

blogsRouter.post("", (request, response) => {
  const blog = new Blog(request.body);
  blog.likes = request.body.likes || 0;
  if (!blog.title || !blog.url) {
    return response.status(400).json({ error: "Title and URL are required" });
  } else {
    blog.save().then((result) => {
      response.status(201).json(result);
    });
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findOneAndDelete(request.params.id);
  response.status(204).end();
});

module.exports = blogsRouter;
