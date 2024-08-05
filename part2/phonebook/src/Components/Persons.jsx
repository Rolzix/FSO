import server from "./server";
const Persons = ({
  persons,
  filtered,
  filterstatus,
  setPersons,
  showNotification,
}) => {
  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      server
        .dbDelete(id)
        .then((response) => {
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch((error) => {
          showNotification(
            `Information of ${name} has already been removed from the server`,
            "red"
          );
          setPersons(persons.filter((person) => person.id !== id));
        });
    }
  };

  return (
    <div>
      {filterstatus
        ? filtered.map((person) => (
            <div key={person.id}>
              {person.name} {person.number}
              <button onClick={() => handleDelete(person.id, person.name)}>
                delete
              </button>
            </div>
          ))
        : persons.map((person) => (
            <div key={person.id}>
              {person.name} {`${person.number} `}
              <button onClick={() => handleDelete(person.id, person.name)}>
                delete
              </button>
            </div>
          ))}
    </div>
  );
};
export default Persons;
