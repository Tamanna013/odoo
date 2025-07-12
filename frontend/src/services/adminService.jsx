import API from './api';

export const getUsers = async () => {
  const response = await API.get('/admin/users');
  return response.data;
};

export const getItems = async () => {
  const response = await API.get('/admin/items');
  return response.data;
};

export const getSwaps = async () => {
  const response = await API.get('/admin/swaps');
  return response.data;
};