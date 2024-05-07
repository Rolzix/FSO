const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
// console.log("app", app);
const api = supertest(app);

const initialUsers = [
  {
    username: "user1",
    name: "User One",
    password: "password",
    userId: "663904ebc862ba6ddd11ebaf",
  },
  {
    username: "Paul",
    name: "Paul Muad'Dib Atreides",
    password: "LisanAlGaib",
  },
  {
    username: "user3",
    name: "User Three",
    password: "password",
  },
];

beforeEach(async () => {
  await User.deleteMany({});
  let userObject = new User(initialUsers[0]);
  await userObject.save();
  userObject = new User(initialUsers[1]);
  await userObject.save();
});

test("user without username or name is not added", async () => {
  const users = await User.find({});
  const amount = users.length;
  const newUser = {
    password: "password",
  };
  await api.post("/api/users").send(newUser).expect(400);
  const usersAtEnd = await User.find({});
  assert(usersAtEnd.length === amount);
});

test("user without password is not added", async () => {
  const users = await User.find({});
  const amount = users.length;
  const newUser = {
    username: "newuser",
    name: "New User",
  };
  await api.post("/api/users").send(newUser).expect(400);
  const usersAtEnd = await User.find({});
  assert(usersAtEnd.length === amount);
});

test("user with password shorter than 3 characters is not added", async () => {
  const users = await User.find({});
  const amount = users.length;
  const newUser = {
    username: "newuser",
    name: "New User",
    password: "pw",
  };
  await api.post("/api/users").send(newUser).expect(400);
  const usersAtEnd = await User.find({});
  assert(usersAtEnd.length === amount);
});

test("user with username shorter than 3 characters is not added", async () => {
  const users = await User.find({});
  const amount = users.length;
  const newUser = {
    username: "us",
    name: "New User",
    password: "password",
  };
  await api.post("/api/users").send(newUser).expect(400);
  const usersAtEnd = await User.find({});
  assert(usersAtEnd.length === amount);
});

after(async () => {
  await mongoose.connection.close();
});
