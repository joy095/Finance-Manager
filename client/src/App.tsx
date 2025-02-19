/** @format */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./routes/dashboard";
import Register from "./routes/register";
import Login from "./routes/login";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
