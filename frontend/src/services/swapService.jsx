import API from './api';

export const getSwaps = async () => {
  const response = await API.get('/swaps');
  return response.data;
};

export const respondToSwap = async ({ swapId, action }) => {
  const response = await API.put('/swaps/respond', { swapId, action });
  return response.data;
};

export const cancelSwap = async (swapId) => {
  const response = await API.delete(`/swaps/${swapId}`);
  return response.data;
};