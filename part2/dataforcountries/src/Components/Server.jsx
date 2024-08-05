import axios from "axios";
const getOwData = (city, key) => {
  const request = axios.get(
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${key}`
  );
  return request.then((response) => response.data);
};

export default { getOwData };
