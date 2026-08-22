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
    <section className="page" style={styles.container}>
      <div style={styles.card}>
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.logo}>
            <span>⌘</span>
          </div>

          <h2 style={styles.title}>Bienvenido</h2>

          <p style={styles.subtitle}>
            Inicia sesión para continuar
          </p>

          
        </div>

        {/* ERROR */}
        {error && (
          <div style={styles.errorMessage}>
            <span style={styles.errorIcon}>!</span>
            <span>{error}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Correo electrónico
            </label>

            <input
              type="text"
              placeholder="admin@python.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.passwordHeader}>
              <label style={styles.label}>
                Contraseña
              </label>

              <span style={styles.forgotPassword}>
                ¿Olvidaste tu contraseña?
              </span>
            </div>

            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />

            
          </div>

          <button type="submit" style={styles.button}>
            Iniciar sesión
            <span style={styles.arrow}>→</span>
          </button>

          
        </form>

        {/* FOOTER */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            ¿No tienes una cuenta?{" "}
            <Link to="/register" style={styles.link}>
              Regístrate
            </Link>
          </p>
        </div>

        <button style={styles.regresar} onClick={() => navigate(-1)}>
              ← Regresar
            </button>
      </div>
    </section>
  );
}

const styles: { [key: string]: React.CSSProperties } = {

  regresar: {
  marginBottom: "20px",
  padding: "9px 16px",
  background: "#fff",
  color: "#475569",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 600,
},

  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 140px)",
    padding: "40px 20px",
    background:
      "radial-gradient(circle at top, #172554 0%, #0f172a 45%, #020617 100%)",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "42px",
    backgroundColor: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    borderRadius: "20px",
    boxShadow:
      "0 25px 60px rgba(0, 0, 0, 0.45), 0 0 40px rgba(14, 165, 233, 0.05)",
    backdropFilter: "blur(16px)",
  },

  header: {
    textAlign: "center",
    marginBottom: "32px",
  },

  logo: {
    width: "52px",
    height: "52px",
    margin: "0 auto 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "14px",
    background:
      "linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)",
    color: "#ffffff",
    fontSize: "25px",
    fontWeight: "bold",
    boxShadow: "0 8px 25px rgba(6, 182, 212, 0.25)",
  },

  title: {
    color: "#f8fafc",
    fontSize: "30px",
    fontWeight: 700,
    margin: "0 0 8px",
    letterSpacing: "-0.6px",
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: "14px",
    margin: 0,
  },

  errorMessage: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 14px",
    marginBottom: "22px",
    backgroundColor: "rgba(127, 29, 29, 0.22)",
    border: "1px solid rgba(248, 113, 113, 0.35)",
    borderRadius: "10px",
    color: "#fca5a5",
    fontSize: "13px",
    lineHeight: "1.4",
  },

  errorIcon: {
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderRadius: "50%",
    backgroundColor: "rgba(248, 113, 113, 0.2)",
    color: "#f87171",
    fontWeight: "bold",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "21px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "9px",
  },

  passwordHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    color: "#e2e8f0",
    fontSize: "13px",
    fontWeight: 600,
  },

  forgotPassword: {
    color: "#64748b",
    fontSize: "11px",
    cursor: "pointer",
  },

  input: {
    width: "100%",
    height: "48px",
    padding: "0 15px",
    backgroundColor: "#080f1d",
    border: "1px solid #263244",
    borderRadius: "10px",
    color: "#f8fafc",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },

  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    width: "100%",
    height: "48px",
    marginTop: "5px",
    padding: "0 18px",
    background:
      "linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(6, 182, 212, 0.22)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },

  arrow: {
    fontSize: "18px",
    lineHeight: 1,
  },

  footer: {
    marginTop: "28px",
    paddingTop: "20px",
    textAlign: "center",
    borderTop: "1px solid rgba(148, 163, 184, 0.1)",
  },

  footerText: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },

  link: {
    color: "#38bdf8",
    textDecoration: "none",
    fontWeight: 600,
  },
};

export default Login;