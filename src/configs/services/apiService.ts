const jwtServiceConfig = {
  signIn: `${import.meta.env.VITE_API_REST_URL}/login`,
  signUp: `${import.meta.env.VITE_API_REST_URL}/register`,
  chat: `${import.meta.env.VITE_API_REST_URL}/chats`,
  ws: `${import.meta.env.VITE_API_WS_URL}`,
};

export default jwtServiceConfig;
