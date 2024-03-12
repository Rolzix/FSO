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
          showNotification(`Deleted ${name}`, "green");
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
      {filterstatus ? (
        filtered.map((person) => (
          <div key={person.id}>
            {person.name} {person.number}
            <button onClick={() => handleDelete(person.id, person.name)}>
              delete
            </button>
          </div>
        ))
      ) : Array.isArray(persons) && persons.length > 0 ? (
        persons.map((person) => (
          <div key={person.id}>
            {person.name} {`${person.number} `}
            <button onClick={() => handleDelete(person.id, person.name)}>
              delete
            </button>
          </div>
        ))
      ) : (
        <p>No persons to display</p>
      )}
    </div>
  );
};
export default Persons;
