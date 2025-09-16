import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost/sisgen/app/controllers/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      alert("Inicio de sesión exitoso 🚀");
      // Redirigir a dashboard.html
      window.location.href = "http://localhost/sisgen/app/views/dashboard.html";
    } else {
      alert(data.error || "Credenciales incorrectas ❌");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("No se pudo conectar con el servidor");
  }
};


  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ maxWidth: 900, width: "100%" }}>
        <div className="row g-0">
          {/* Imagen */}
          <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-light">
            <img src="../public/LogoGlobesoft.png" alt="Logo Globesoft" className="logo-globesoft" />
          </div>

          {/* Formulario */}
          <div className="col-md-6 p-4">
            <h2 className="mb-4 text-center fw-bold" style={{ color: "#181141" }}>¡Bienvenido de nuevo!</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Usuario</label>
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
                  placeholder="Ingresa tu contraseña"
                />
              </div>
              <button type="submit" className="btn custom-btn w-100 mb-3">Iniciar sesión</button>
              <div className="text-center">
                <a href="/register.jsx" style={{ color: "#181141" }}>Crear cuenta</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
