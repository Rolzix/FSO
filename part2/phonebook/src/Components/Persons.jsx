const Persons = ({ persons, filtered, filterstatus }) => {
  return (
    <div>
      {filterstatus
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
