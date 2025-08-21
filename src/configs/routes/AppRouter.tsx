import { BrowserRouter, Route, Routes } from "react-router";
import { Login } from "../../pages/Login";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chats" element={<h1>Colocar elemento</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<h1>Colocar elemento</h1>} />
        <Route path="*" element={<h1>Colocar elemento 404</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
