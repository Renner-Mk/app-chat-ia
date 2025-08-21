import { BrowserRouter, Route, Routes } from "react-router";
import { Login } from "../../pages/Login";
import { Register } from "../../pages/Register";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chats" element={<h1>Colocar elemento</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<h1>Colocar elemento 404</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
