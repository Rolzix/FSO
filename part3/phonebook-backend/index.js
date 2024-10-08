require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./Models/person");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("body", function (req) {
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

// let data;
// async function fetchPersons() {
//   data = await Person.find({ name: { $exists: true } }).then((persons) => {
//     return persons;
//   });
// }
// fetchPersons();

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "invalid token" });
  }

  next(error);
};

app.get("/api/persons", (request, response) => {
  Person.find({ name: { $exists: true } }).then((persons) => {
    // console.log("persons", persons);
    response.json(persons);
  });
});

app.get("/api/info", (request, response, next) => {
  Person.countDocuments({ name: { $exists: true } })
    .then((count) => {
      const info = `Phonebook has info for ${count} people <br><br> ${new Date()}`;
      response.send(info);
    })
    .catch((error) => {
      next(error);
    });
});
app.get("/api/persons/:id", (request, response, next) => {
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
      next(error);
    });
});

app.delete("/api/persons/:id", (request, response, next) => {
  const paramId = request.params.id;

  Person.findByIdAndDelete(paramId)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => {
      console.error("Error deleting person:");
      next(error);
    });
});

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;
  if (name && number) {
    const newEntry = new Person({
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
        response.status(400).json({ error: error });
      });
  } else if (!name) {
    return response.status(400).json({ error: "missing name" });
  } else {
    return response.status(400).json({ error: "missing number" });
  }
});

app.put("/api/persons/:id", (request, response, next) => {
  const paramId = request.params.id;
  const { name, number } = request.body;

  const person = {
    name: name,
    number: number,
  };

  Person.findByIdAndUpdate(paramId, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => {
      console.error("Error updating person:", error);
      next(error);
    });
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
