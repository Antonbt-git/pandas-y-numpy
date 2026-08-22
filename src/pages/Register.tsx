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
        setError("AuthError: Todos los campos son obligatorios");
        return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("registered_users") || "[]");

    const userExists = existingUsers.some((u: { email?: string }) => u.email === email);
    if (userExists) {
        setError("AuthError: El usuario o correo ya está registrado");
        return;
    }

    existingUsers.push({ email, password });
    localStorage.setItem("registered_users", JSON.stringify(existingUsers));

    setSuccess("¡Registro exitoso! Redirigiendo al login...");
    setTimeout(() => {
        navigate("/");
    }, 1500);
    };

return (
    <section className="page" style={styles.container}>
    <div style={styles.card}>
        <div style={styles.header}>
        <div style={styles.badge}>
            <span style={styles.promptSymbol}>&gt;&gt;&gt;</span> import register
        </div>
        <h2 style={styles.title}>Registro</h2>
        <p style={styles.subtitle}>Crea una cuenta para acceder a la terminal</p>
        </div>

        {error && (
        <div style={styles.errorMessage}>
            <code>{error}</code>
        </div>
        )}

        {success && (
        <div style={styles.successMessage}>
            <code>{success}</code>
        </div>
        )}

        <form onSubmit={handleRegister} style={styles.form}>
        <div style={styles.inputGroup}>
            <label style={styles.label}>
            <code>user_email =</code>
            </label>
            <input
            type="text"
            placeholder="tu_usuario"
            value={email}
        onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
            />
            </div>

            <div style={styles.inputGroup}>
            <label style={styles.label}>
                <code>password =</code>
            </label>
            <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
            />
            </div>

            <button type="submit" style={styles.button}>
            <code>execute_register()</code>
            </button>
        </form>

        <div style={styles.footer}>
            <p style={styles.footerText}>
            ¿Ya tienes cuenta?{" "}
            <Link to="/" style={styles.link}>
                <code>login()</code>
            </Link>
            </p>
        </div>
        </div>
    </section>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 140px)",
    },
    card: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "#16103a",
    borderRadius: "20px",
    padding: "35px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
    border: "1px solid rgba(168, 85, 247, 0.25)",
    },
    header: {
    textAlign: "center",
    marginBottom: "28px",
    },
    badge: {
    display: "inline-block",
    backgroundColor: "#1e1b4b",
    color: "#38bdf8",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontFamily: "monospace",
    marginBottom: "12px",
    border: "1px solid rgba(168, 85, 247, 0.4)",
    },
    promptSymbol: {
    color: "#ffd43b",
    fontWeight: "bold",
    },
    title: {
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: "bold",
    margin: "8px 0",
    textShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
    },
    subtitle: {
    color: "#94a3b8",
    fontSize: "14px",
    },
    errorMessage: {
    backgroundColor: "#451a1a",
    border: "1px solid #f87171",
    color: "#fca5a5",
    padding: "10px 12px",
    borderRadius: "10px",
    fontSize: "13px",
    marginBottom: "20px",
    },
    successMessage: {
    backgroundColor: "#064e3b",
    border: "1px solid #10b981",
    color: "#a7f3d0",
    padding: "10px 12px",
    borderRadius: "10px",
    fontSize: "13px",
    marginBottom: "20px",
    },
    form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    },
    inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    },
    label: {
    color: "#cbd5e1",
    fontSize: "13px",
    fontWeight: 500,
    },
    input: {
    width: "100%",
    padding: "12px 15px",
    backgroundColor: "#110d2b",
    border: "1px solid rgba(168, 85, 247, 0.3)",
    borderRadius: "10px",
    color: "#f8fafc",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    },
        button: {
    marginTop: "10px",
    padding: "14px",
    background: "linear-gradient(135deg, #9333ea 0%, #db2777 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(147, 51, 234, 0.4)",
    transition: "all 0.2s ease",
    },
    footer: {
    marginTop: "24px",
    textAlign: "center",
    borderTop: "1px solid rgba(168, 85, 247, 0.2)",
    paddingTop: "16px",
    },
    footerText: {
    color: "#94a3b8",
    fontSize: "14px",
    },
    link: {
    color: "#c084fc",
    textDecoration: "none",
    fontWeight: "bold",
        },
};

export default Register;