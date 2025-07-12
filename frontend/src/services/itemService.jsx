import API from './api';

export const getItems = async (params = {}) => {
  const response = await API.get('/items', { params });
  return response.data;
};

export const getItemById = async (id) => {
  const response = await API.get(`/items/${id}`);
  return response.data;
};

export const createItem = async (formData) => {
  const response = await API.post('/items', formData);
  return response.data;
};

export const requestSwap = async (swapData) => {
  const response = await API.post('/swaps', swapData);
  return response.data;
};

export const deleteItem = async (itemId) => {
  return await API.delete(`/items/${itemId}`);
};