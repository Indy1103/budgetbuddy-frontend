import axios from 'axios';
const API = import.meta.env.VITE_API_URL;

export async function login(email, password) {
  const res = await axios.post(`${API}/api/auth/login`, { email, password });
  return res.data; // { token }
}

export async function signup(email, password, inviteCode) {
  const res = await axios.post(`${API}/api/auth/signup`, {
    email, password, inviteCode
  });
  return res.data; // { id, email, createdAt }
}