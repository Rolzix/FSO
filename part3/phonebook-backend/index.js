const express = require("express");

const app = express();

app.use(express.json());

const data = [
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
    console.log(id);
    response.send(info);
  } else {
    response.status(404).send("Id not found");
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
