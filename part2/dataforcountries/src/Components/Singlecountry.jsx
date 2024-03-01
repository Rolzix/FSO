const Singlecountry = ({ country }) => {
  //   console.log("at Single contry component", country);
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>area: {country.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map((language) => {
          return <li key={language}>{language}</li>;
        })}
      </ul>
      <img src={country.flags.png} alt={country.name.common} />
    </div>
  );
};
export default Singlecountry;
