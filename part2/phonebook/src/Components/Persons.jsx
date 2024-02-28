const Persons = ({ persons, filtered }) => {
  return (
    <div>
      {filtered
        ? filtered.map((person) => (
            <div key={person.name}>
              {person.name} {person.number}
            </div>
          ))
        : persons.map((person) => (
            <div key={person.name}>
              {person.name} {person.number}
            </div>
          ))}
    </div>
  );
};
export default Persons;
