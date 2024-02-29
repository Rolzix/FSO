import { useState, useEffect } from "react";
import Filter from "./Components/Filter";
import PersonForm from "./Components/PersonForm";
import Persons from "./Components/Persons";
import server from "./Components/server";
import Notification from "./Components/Notification";
import "./App.css";
const App = () => {
  const [persons, setPersons] = useState([]);
  const [filtered, setFiltered] = useState(persons);
  const [filterStatus, setFilterStatus] = useState(false);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    server.getAll().then((response) => {
      setPersons(response);
    });
  }, []);

  const filter = (e) => {
    if (e.target.value === "") {
      setFiltered(persons);
      setFilterStatus(false);
    } else {
      const filtered = persons.filter((person) =>
        person.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFiltered(filtered);
      setFilterStatus(true);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentPerson = persons.find((person) => person.name === newName);

    if (currentPerson && currentPerson.number === newNumber) {
      alert(`${newName} is already added to phonebook`);
    } else if (currentPerson) {
      if (
        confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const updatedPerson = { ...currentPerson, number: newNumber };
        server.update(currentPerson.id, updatedPerson).then((response) => {
          setPersons(
            persons.map((person) =>
              person.id !== currentPerson.id ? person : response
            )
          );
          showNotification(`Updated ${newName} number to ${newNumber}`);
        });
      }
    } else {
      const newEntry = { name: newName, number: newNumber };
      server.create(newEntry).then((response) => {
        setPersons(persons.concat(response));
        showNotification(`Added ${newName}`);
      });
    }
    e.target.reset();
  };
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <Filter filter={filter} persons={persons} />
      <h3>Add a new:</h3>
      <PersonForm
        handleSubmit={handleSubmit}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
      />
      <h3>Numbers</h3>
      <Persons
        persons={persons}
        filtered={filtered}
        filterstatus={filterStatus}
        setPersons={setPersons}
      />
    </div>
  );
};

export default App;
