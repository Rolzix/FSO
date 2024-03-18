const { test, after } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
// console.log("app", app);
const api = supertest(app);

test("notes are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
}).catch((error) => console.error(error));

after(async () => {
  await mongoose.connection.close();
});
