import axios from "axios";

const REST_URL = import.meta.env.VITE_API_REST_URL;
const WS_URL = import.meta.env.VITE_API_WS_URL;

if (!REST_URL || !WS_URL) {
  throw new Error(
    "As variáveis de ambiente VITE_API_REST_URL ou VITE_API_WS_URL não estão definidas!"
  );
}

export const api = axios.create({
  baseURL: REST_URL,
});

export const ws = new WebSocket(WS_URL);
