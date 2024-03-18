const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const blog = require("../models/blog");
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
  await blog.deleteMany({});
  let blogObject = new blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new blog(initialBlogs[1]);
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

test.only("a valid blog can be added", async () => {
  const blogs = await blog.find({});
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

  const blogsAfterAddition = await blog.find({});
  assert.strictEqual(blogsAfterAddition.length, amount + 1);
  const addedBlog = blogsAfterAddition.find((b) => b.title === newBlog.title);
  assert(addedBlog);
  assert.strictEqual(addedBlog.author, newBlog.author);
  assert.strictEqual(addedBlog.url, newBlog.url);
  assert.strictEqual(addedBlog.likes, newBlog.likes);
});

after(async () => {
  await mongoose.connection.close();
});
