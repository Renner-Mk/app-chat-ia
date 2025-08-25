import { BrowserRouter, Route, Routes } from "react-router";
import { Login } from "../../pages/Login";
import { Register } from "../../pages/Register";
import { ErrorPage } from "../../pages/Error";
import { WSProtectedRoutes } from "./WsRoutes";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<WSProtectedRoutes />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}
