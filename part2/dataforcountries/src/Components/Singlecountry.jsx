const Singlecountry = ({ country, weather }) => {
  // console.log("at Single contry component", country, weather);
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

      {weather === undefined ? (
        <p>Loading weather data</p>
      ) : (
        <div>
          <h2>Weather in {country.capital}</h2>
          <p>Temperature: {weather.main.temp} Celsius</p>
          <p>Wind: {weather.wind.speed} m/s</p>
          <p> {weather.weather[0].description} </p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt={weather.weather[0].description}
          />
        </div>
      )}
    </div>
  );
};
export default Singlecountry;
