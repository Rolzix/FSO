import { useState } from "react";
import countries from "../db.json";
import Singlecountry from "./Components/Singlecountry";
import Server from "./Components/Server";
import "./App.css";

const OW_KEY = import.meta.env.VITE_OW_KEY;
function App() {
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [findAmount, setFindAmount] = useState(Infinity);
  const [selectedCountry, setSelectedCountry] = useState();
  const [weather, setWeather] = useState();
  const handleFilter = (e) => {
    setFilter(e.target.value);
    const found = countries.filter((country) =>
      country.name.common.toLowerCase().includes(e.target.value.toLowerCase())
    ).length;
    setFindAmount(found);

    if (found > 10) {
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
    }
    // Single country selected here
    else {
      const targetCountry = countries.filter((country) => {
        return country.name.common
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      });
      setFilteredCountries(targetCountry);
      setSelectedCountry(targetCountry);
      Server.getOwData(targetCountry[0].capital[0], OW_KEY)
        .then((response) => {
          console.log("weather response", response);
          setWeather(response);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  };

  const selectSingleCountry = (country) => {
    const targetCountry = countries.filter((targetCountry) => {
      return targetCountry.name.common === country.name.common;
    });
    setFilteredCountries(targetCountry);
    setSelectedCountry(targetCountry);
    setFindAmount(1);
  };

  return (
    <div>
      Find countries: <input onChange={handleFilter}></input>
      {findAmount === 1 ? (
        <Singlecountry country={filteredCountries[0]} weather={weather} />
      ) : findAmount > 10 ? (
        <p>Too many matches, please be more specific</p>
      ) : findAmount > 1 ? (
        filteredCountries.map((country) => (
          <div className="country" key={country.name.common}>
            {country.name.common}
            <button onClick={() => selectSingleCountry(country)}>show</button>
          </div>
        ))
      ) : (
        <p>No matches found</p>
      )}
    </div>
  );
}
export default App;
