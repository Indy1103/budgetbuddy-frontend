// src/api/transactions.js
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

function authHeaders(token) {
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
}

export async function getTransactions(token) {
  const res = await axios.get(`${API}/api/transactions`, authHeaders(token));
  return res.data;  // array of transactions
}

export async function createTransaction(data, token) {
  const res = await axios.post(
    `${API}/api/transactions`,
    data,
    authHeaders(token)
  );
  return res.data;  // newly created transaction
}

export async function deleteTransaction(id, token) {
    const res = await axios.delete(
      `${API}/api/transactions/${id}`,
      authHeaders(token)
    );
    return res.data;  // { success: true }
  }

export async function updateTransaction(id, data, token) {
  const res = await axios.put(
    `${API}/api/transactions/${id}`,
    data,
    authHeaders(token)
  );
  return res.data;  // { success: true }
}

