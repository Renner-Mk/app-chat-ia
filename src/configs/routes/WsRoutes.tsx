import { Route, Routes } from "react-router";
import { WSProvider } from "../../context/WSProvider";
import { Home } from "../../pages/Home";

export function WSProtectedRoutes() {
  return (
    <WSProvider>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </WSProvider>
  );
}
