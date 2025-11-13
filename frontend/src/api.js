import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3001" });

export const getChats = (token) =>
  API.get("/chat", { headers: { Authorization: `Bearer ${token}` } });

export const getMessages = (chatId, token) =>
  API.get(`/message/${chatId}`, { headers: { Authorization: `Bearer ${token}` } });

export const sendMessage = (chatId, content, token) =>
  API.post(`/message/${chatId}`, { content }, { headers: { Authorization: `Bearer ${token}` } });
