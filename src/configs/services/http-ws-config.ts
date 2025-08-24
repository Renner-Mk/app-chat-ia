import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_REST_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // redireciona sem hook
    }

    return Promise.reject(error);
  }
);

export default api;

export function createWs(token: string): WebSocket {
  const ws = new WebSocket(`${import.meta.env.VITE_API_WS_URL}?token=${token}`);

  ws.onopen = () => console.log("WS conectado!");

  ws.onerror = (err) => console.error("Erro WS:", err);

  ws.onclose = () => console.log("WS desconectado!");

  return ws;
}
