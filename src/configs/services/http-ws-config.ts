import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_REST_URL,
});

export function createWs(token: string): WebSocket {
  const ws = new WebSocket(`${import.meta.env.VITE_API_WS_URL}?token=${token}`);

  ws.onopen = () => console.log("WS conectado!");

  ws.onerror = (err) => console.error("Erro WS:", err);

  ws.onclose = () => console.log("WS desconectado!");

  return ws;
}
