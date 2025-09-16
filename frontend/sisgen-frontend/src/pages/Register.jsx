import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost/sisgen/app/controllers/register.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Usuario registrado con éxito 🚀");
      console.log("Respuesta:", data);
    } else {
      alert(data.error || "Error en el registro ❌");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("No se pudo conectar con el servidor");
  }
};


  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ maxWidth: 600, width: "100%" }}>
        <div className="p-4">
          <h2 className="mb-4 text-center fw-bold" style={{ color: "#181141" }}>Crear cuenta</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control input-morado"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingresa tu nombre"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control input-morado"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu correo"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control input-morado"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Crea una contraseña"
              />
            </div>
            <button type="submit" className="btn custom-btn w-100 mb-3">Registrarme</button>
            <div className="text-center">
              <Link to="/login.jsx" style={{ color: "#181141" }}>Ya tengo cuenta</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
