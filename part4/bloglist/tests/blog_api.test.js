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

test.only("unique identifier property of the blog posts is named id and not _id", async () => {
  const response = await api.get("/api/blogs");
  const blog = response.body[0];
  console.log(blog);
  assert(blog.id && !blog._id);
});

after(async () => {
  await mongoose.connection.close();
});
