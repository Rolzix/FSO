const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
// console.log("app", app);
const api = supertest(app);

const initialBlogs = [
  {
    title: "Paul Muad'Dib Atreides",
    author: "12345",
    url: "http://www.dune.com",
    likes: 9999,
  },
  {
    title: "John Doe's Blog",
    author: "John Doe",
    url: "http://www.johndoe.com",
    likes: 100,
  },
  {
    title: "Jane Smith's Blog",
    author: "Jane Smith",
    url: "http://www.janesmith.com",
    likes: 50,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
}).catch((error) => console.error(error));

test("unique identifier property of the blog posts is named id and not _id", async () => {
  const response = await api.get("/api/blogs");
  const blog = response.body[0];
  console.log(blog);
  assert(blog.id && !blog._id);
});

test("a valid blog can be added", async () => {
  const blogs = await Blog.find({});
  const amount = blogs.length;
  const newBlog = {
    title: "New Blog Entry",
    author: "John Smith",
    url: "http://www.newblog.com",
    likes: 10,
  };
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAfterAddition = await Blog.find({});
  assert.strictEqual(blogsAfterAddition.length, amount + 1);
  const addedBlog = blogsAfterAddition.find((b) => b.title === newBlog.title);
  assert(addedBlog);
  assert.strictEqual(addedBlog.author, newBlog.author);
  assert.strictEqual(addedBlog.url, newBlog.url);
  assert.strictEqual(addedBlog.likes, newBlog.likes);
});

test("if likes property is missing, it will default to 0", async () => {
  const newBlog = {
    title: "Blog without Likes",
    author: "Jane Doe",
    url: "http://www.blogwithoutlikes.com",
  };
  const response = await api.post("/api/blogs").send(newBlog);
  assert.strictEqual(response.body.likes, 0);
});

test("if title or url properties are missing, backend responds with 400 Bad Request", async () => {
  const newBlog = {
    author: "Jane Doe",
    likes: 10,
  };

  const response = await api.post("/api/blogs").send(newBlog);
  console.log(response);
  assert.strictEqual(response.status, 400);
});

test("If a blog is deleted succesfully, response 204 and blog is not the same as the spot it was deleted from", async () => {
  const blogsBeforeDelete = await Blog.find({});
  const blogToDelete = blogsBeforeDelete[0];

  const response = await api.delete(`/api/blogs/${blogToDelete._id}`);
  assert.strictEqual(response.status, 204);

  const blogsAfterDelete = await Blog.find({});
  assert.strictEqual(blogsAfterDelete.length, 1);
  assert.notStrictEqual(
    blogsAfterDelete[0]._id.toString(),
    blogToDelete._id.toString()
  );
});

test.only("If a blog is updated succesfully, response 200 and blog is updated", async () => {
  const blogsBeforeUpdate = await Blog.find({});
  const blogToUpdate = blogsBeforeUpdate[0];
  const updatedBlog = { _id: blogToUpdate._id.toString(), likes: 1000 };
  const response = await api
    .put(`/api/blogs/${blogToUpdate._id}`)
    .send(updatedBlog);
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.likes, 1000);
});

after(async () => {
  await mongoose.connection.close();
});
