import { Route, Routes } from "react-router";
import { WSProvider } from "../../context/WSProvider";
import { Home } from "../../pages/Home";

const token = localStorage.getItem("token") ?? "";

export function WSProtectedRoutes() {
  return (
    <WSProvider token={token}>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </WSProvider>
  );
}
