import { BrowserRouter, Route, Routes } from "react-router";
import { Login } from "../../pages/Login";
import { Register } from "../../pages/Register";
import { Home } from "../../pages/Home";
import { ErrorPage } from "../../pages/Error";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}
