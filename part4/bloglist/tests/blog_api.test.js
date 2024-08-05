const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const api = supertest(app);
const loginUser = async () => {
  const userCredentials = {
    username: "Paul",
    password: "LisanAlGaib",
  };

  const response = await api
    .post("/api/login")
    .send(userCredentials)
    .expect(200);

  return response.body;
};

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

  const user = await loginUser();
  const token = user.token;

  for (let blog of initialBlogs) {
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blog);
  }
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
  assert(blog.id && !blog._id);
});

test("a valid blog can be added", async () => {
  const blogs = await Blog.find({});
  const amount = blogs.length;

  const user = await loginUser();
  const token = user.token;

  const newBlog = {
    title: "Dune",
    author: "Paul",
    url: "http://www.dune.com",
    likes: 9999,
    userId: user.id,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
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

test.only("adding a blog fails with the proper status code 401 Unauthorized if a token is not provided", async () => {
  const user = await loginUser();

  const newBlog = {
    title: "Dune",
    author: "Paul",
    url: "http://www.dune.com",
    likes: 9999,
    userId: user.id,
  };

  await api
    .post("/api/blogs")

    .send(newBlog)
    .expect(401)
    .expect("Content-Type", /application\/json/);
});

test("if likes property is missing, it will default to 0", async () => {
  const newBlog = {
    title: "Blog without Likes",
    author: "Jane Doe",
    url: "http://www.blogwithoutlikes.com",
  };
  const user = await loginUser();
  const token = user.token;

  const response = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  assert.strictEqual(response.body.likes, 0);
});

test.only("if title or url properties are missing, backend responds with 400 Bad Request", async () => {
  const newBlog = {
    author: "Jane Doe",
    likes: 10,
  };

  const user = await loginUser();
  const token = user.token;

  const response = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
    .expect("Content-Type", /application\/json/);
  assert.strictEqual(response.status, 400);
});

test.only("If a blog is deleted successfully, response 200 and blog is not the same as the spot it was deleted from", async () => {
  const user = await loginUser();
  const token = user.token;
  const blogsBeforeDelete = await Blog.find({});
  const blogToDelete = blogsBeforeDelete.find(
    (blog) => blog.user.toString() === user.id
  );
  const response = await api
    .delete(`/api/blogs/${blogToDelete._id}`)
    .set("Authorization", `Bearer ${token}`);
  assert.strictEqual(response.status, 200);

  const blogsAfterDelete = await Blog.find({});
  assert.strictEqual(blogsBeforeDelete.length, blogsAfterDelete.length + 1);
  assert.notStrictEqual(
    blogsAfterDelete[0]._id.toString(),
    blogToDelete._id.toString()
  );
});

test("If a blog is updated succesfully, response 200 and blog is updated", async () => {
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
