const express = require("express");

const app = express();

app.use(express.json());

let data = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => response.json(data));

app.get("/api/info", (request, response) => {
  const info = `Phonebook has info for ${
    data.length
  } people <br><br> ${new Date()}`;

  response.send(info);
});

app.get("/api/persons/:id", (request, response) => {
  const paramId = request.params.id;
  if (data[paramId]) {
    const { id, name, number } = data[paramId];
    const info = `id: ${id} <br> name: ${name} <br> number: ${number}`;
    response.send(info);
  } else {
    response.status(404).send("Id not found");
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const paramId = request.params.id;
  const removedEntry = data.find((person) => person.id == paramId);
  data = data.filter((person) => person.id != paramId);
  response.send(`deleted ${removedEntry.name}`);
});

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;
  newEntry = {
    id: Math.floor(Math.random() * 10000),
    name: name,
    number: number,
  };

  data = data.concat(newEntry);
  response.json(newEntry);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
