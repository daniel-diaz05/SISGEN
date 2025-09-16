import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/Login.jsx" />} />
        <Route path="/Login.jsx" element={<Login />} />
        <Route path="/Register.jsx" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
