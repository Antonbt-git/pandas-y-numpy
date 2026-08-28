import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register(): React.ReactElement {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("registered_users") || "[]");

    const userExists = existingUsers.some((u: { email?: string }) => u.email === email);
    if (userExists) {
      setError("Ese usuario o correo ya está registrado.");
      return;
    }

    existingUsers.push({ email, password });
    localStorage.setItem("registered_users", JSON.stringify(existingUsers));

    setSuccess("¡Registro exitoso! Redirigiendo al login...");
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <section className="page auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-badge">Crear cuenta</span>
          <h2 className="auth-title">Registro</h2>
          <p className="auth-subtitle">Crea una cuenta para acceder al dashboard</p>
        </div>

        {error && (
          <div className="auth-message is-error">
            <span className="auth-message-icon">!</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="auth-message is-success">
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="auth-form">
          <div className="auth-input-group">
            <label className="auth-label">Correo electrónico</label>
            <input
              type="text"
              placeholder="tu_usuario@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
            />
          </div>

          <button type="submit" className="auth-submit">
            Crear cuenta
            <span>→</span>
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="auth-link">
              Inicia sesión
            </Link>
          </p>
        </div>

        <button className="auth-back" onClick={() => navigate(-1)}>
          ← Regresar
        </button>
      </div>
    </section>
  );
}

export default Register;
