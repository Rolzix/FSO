import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const create = (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  console.log("[debug] token", token, "config", config);
  return axios
    .post(baseUrl, newObject, config)
    .then((response) => response.data);
};

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const deleteOne = (id) => {
  const config = {
    headers: { Authorization: token },
  };
  return axios
    .delete(`${baseUrl}/${id}`, config)
    .then((response) => response.data);
};

export default { getAll, create, setToken, update, deleteOne };
