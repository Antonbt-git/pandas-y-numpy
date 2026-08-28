import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login(): React.ReactElement {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Usuario por defecto del sistema
    const isDefaultAdmin =
      (email === "admin" || email === "admin@python.org") &&
      password === "admin";

    // Buscar usuarios registrados
    const registeredUsers = JSON.parse(
      localStorage.getItem("registered_users") || "[]"
    );

    const foundUser = registeredUsers.find(
      (u: { email?: string; password?: string }) =>
        u.email === email && u.password === password
    );

    if (isDefaultAdmin || foundUser) {
      navigate("/dashboard");
    } else {
      setError("Credenciales inválidas. Verifica tu correo y contraseña.");
    }
  };

  return (
    <section className="page auth-shell">
      <div className="auth-card">
        {/* HEADER */}
        <div className="auth-header">
          <div className="auth-logo">
            <span>⌘</span>
          </div>

          <h2 className="auth-title">Bienvenido</h2>
          <p className="auth-subtitle">Inicia sesión para continuar</p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="auth-message is-error">
            <span className="auth-message-icon">!</span>
            <span>{error}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label className="auth-label">Correo electrónico</label>

            <input
              type="text"
              placeholder="admin@python.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
            />
          </div>

          <div className="auth-input-group">
            <div className="auth-label-row">
              <label className="auth-label">Contraseña</label>
              <span className="auth-forgot">¿Olvidaste tu contraseña?</span>
            </div>

            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
            />
          </div>

          <button type="submit" className="auth-submit">
            Iniciar sesión
            <span>→</span>
          </button>
        </form>

        {/* FOOTER */}
        <div className="auth-footer">
          <p className="auth-footer-text">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="auth-link">
              Regístrate
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

export default Login;
