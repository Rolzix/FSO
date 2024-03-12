require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./Models/person");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("body", function (req, res) {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
});
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens.body(req, res),
    ].join(" ");
  })
);

// let data = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];
let data;
async function fetchPersons() {
  data = await Person.find({ name: { $exists: true } }).then((persons) => {
    // console.log("persons", persons);
    return persons;
  });
}
fetchPersons();

app.get("/api/persons", (request, response) => {
  Person.find({ name: { $exists: true } }).then((persons) => {
    // console.log("persons", persons);
    response.json(persons);
  });
});

app.get("/api/info", (request, response) => {
  const info = `Phonebook has info for ${
    data.length
  } people <br><br> ${new Date()}`;

  response.send(info);
});

app.get("/api/persons/:id", (request, response) => {
  const paramId = request.params.id;
  Person.findById(paramId)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.error("Error fetching person:", error);
      response.status(400).send({ error: "malformatted id" });
    });
  // if (data[paramId]) {
  //   const { id, name, number } = data[paramId];
  //   const info = `id: ${id} <br> name: ${name} <br> number: ${number}`;
  //   response.send(info);
  // } else {
  //   response.status(404).send("Id not found");
  // }
});

app.delete("/api/persons/:id", (request, response) => {
  const paramId = request.params.id;
  // const removedEntry = data.find((person) => person.id == paramId);
  // data = data.filter((person) => person.id != paramId);
  // response.send(`deleted ${removedEntry.name}`);
  Person.findByIdAndDelete(paramId)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      console.error("Error deleting person:", error);
      response.status(400).send({ error: "malformatted id" });
    });
});

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;

  // if (data.find((person) => person.name === name)) {

  //   return response.status(400).json({ error: "name must be unique" });
  // }

  if (name && number) {
    const newEntry = new Person({
      // id: Math.floor(Math.random() * 10000),
      name: name,
      number: number,
    });
    newEntry
      .save()
      .then((savedPerson) => {
        console.log("savedPerson", savedPerson);
        response.json(savedPerson);
      })
      .catch((error) => {
        console.error("Error saving person:", error);
        response
          .status(500)
          .json({ error: "An error occurred while saving the person." });
      });
    // data = data.concat(newEntry);
  } else if (!name) {
    return response.status(400).json({ error: "missing name" });
  } else {
    return response.status(400).json({ error: "missing number" });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
