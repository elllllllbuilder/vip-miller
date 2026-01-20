import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

export async function getUsers() {
  const response = await api.get('/users');
  return response.data;
}

export async function getPayments() {
  const response = await api.get('/payments');
  return response.data;
}

export async function getSubscriptions() {
  const response = await api.get('/subscriptions');
  return response.data;
}
