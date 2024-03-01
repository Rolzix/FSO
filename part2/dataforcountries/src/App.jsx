import { useState } from "react";
import countries from "../db.json";
import Singlecountry from "./Components/Singlecountry";
import "./App.css";

// console.log(countries[0]);
// console.log(countries.length);
function App() {
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [findAmount, setFindAmount] = useState(Infinity);
  const handleFilter = (e) => {
    console.log(e.target.value);
    setFilter(e.target.value);
    const found = countries.filter((country) =>
      country.name.common.toLowerCase().includes(e.target.value.toLowerCase())
    ).length;
    setFindAmount(found);

    if (found > 10) {
      console.log("Too many matches, please be more specific");
      setFilteredCountries([]);
      return;
    } else if (found > 1) {
      setFilteredCountries(
        countries.filter((country) =>
          country.name.common
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        )
      );
    } else {
      setFilteredCountries(
        countries.filter((country) =>
          country.name.common
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        )
      );
      console.log(filteredCountries);
    }
  };

  // console.log("At app", filteredCountries[0]);
  return (
    <div>
      Find countries: <input onChange={handleFilter}></input>
      {findAmount === 1 ? (
        <Singlecountry country={filteredCountries[0]} />
      ) : findAmount > 10 ? (
        <p>Too many matches, please be more specific</p>
      ) : findAmount > 1 ? (
        filteredCountries.map((country) => (
          <div key={country.name.common}>{country.name.common}</div>
        ))
      ) : (
        <p>No matches found</p>
      )}
    </div>
  );
}
export default App;
