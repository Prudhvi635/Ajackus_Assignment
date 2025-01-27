import axios from 'axios';

const BASE_URL = 'https://jsonplaceholder.typicode.com/users';

export const fetchUsers = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const createUser = async (user) => {
  const response = await axios.post(BASE_URL, user);
  return response.data;
};

export const updateUserById = async (id, user) => {
  const response = await axios.put(`${BASE_URL}/${id}`, user);
  return response.data;
};

export const deleteUserById = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
};
