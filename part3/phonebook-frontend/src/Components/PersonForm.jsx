const PersonForm = ({ handleSubmit, setNewName, setNewNumber }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input onChange={(e) => setNewName(e.target.value)} />
      </div>
      <div>
        number: <input onChange={(e) => setNewNumber(e.target.value)} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};
export default PersonForm;
