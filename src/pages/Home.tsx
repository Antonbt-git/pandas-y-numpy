<<<<<<< HEAD
const styles: { [key: string]: React.CSSProperties } = {
  mainContainer: {
    padding: "60px 0",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    marginBottom: "40px",
  },
  headerHero: {
    textAlign: "center",
    marginBottom: "60px",
    position: "relative",
    overflow: "hidden",
    padding: "40px 0",
    borderBottom: "1px solid #e2e8f0",
  },
  titleHero: {
    fontSize: "48px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "15px",
    position: "relative",
    zIndex: 1,
  },
  subtitleHero: {
    fontSize: "20px",
    color: "#4b5563",
    maxWidth: "800px",
    margin: "0 auto",
    lineHeight: "1.6",
    position: "relative",
    zIndex: 1,
  },
  pandasLogoHero: {
    position: "absolute",
    right: "-30px",
    top: "-30px",
    width: "180px",
    opacity: 0.15,
    zIndex: 0,
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "30px",
    marginBottom: "60px",
    padding: "0 40px",
  },
  featureCard: {
    background: "#f9fafb",
    padding: "30px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    position: "relative",
  },
  featureCardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 15px rgba(0,0,0,0.1)",
  },
  featureIcon: {
    width: "60px",
    height: "60px",
    marginBottom: "20px",
  },
  featureTitle: {
    fontSize: "22px",
    marginBottom: "12px",
    color: "#111827",
  },
  featureText: {
    color: "#374151",
    lineHeight: "1.6",
    flex: 1,
  },
  codeSection: {
    backgroundColor: "#1e293b",
    color: "#f8fafc",
    padding: "30px",
    borderRadius: "10px",
    marginBottom: "60px",
    marginLeft: "40px",
    marginRight: "40px",
    boxShadow: "inset 0 2px 10px rgba(0,0,0,0.2)",
  },
  codeHeader: {
    fontSize: "18px",
    marginBottom: "15px",
    color: "#38bdf8",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  codeBlock: {
    fontFamily: "monospace, monospace",
    overflowX: "auto",
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#e2e8f0",
  },
  moreInfoSection: {
    padding: "40px",
    background: "#fdfefe",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    marginBottom: "40px",
    marginLeft: "40px",
    marginRight: "40px",
  },
  infoFlex: {
    display: "flex",
    flexWrap: "wrap",
    gap: "30px",
    alignItems: "flex-start",
  },
  infoTextList: {
    listStyleType: "square",
    paddingLeft: "20px",
    color: "#000000",
    lineHeight: "1.8",
  },
};

function Home() {
  return (
    <div style={styles.mainContainer}>

      <div style={styles.headerHero}>
        <h1 style={styles.titleHero}>BIENVENIDO</h1>

        <p style={styles.subtitleHero}>
          Este es el inicio de nuestro proyecto <strong>React + TypeScript</strong>.
        </p>
      </div>

      <div style={styles.moreInfoSection}>

        <div style={styles.featureCard}>
          <h2 style={styles.featureTitle}>¿Qué es Pandas en Python?</h2>
          <p style={styles.featureText}>
            Pandas es una biblioteca de Python de código abierto usada para la manipulación y el análisis de datos.
            Permite trabajar de forma rápida y flexible con datos en forma de tablas (como hojas de cálculo de Excel o tablas SQL),
            facilitando tareas como limpiar, filtrar, unir y resumir información numérica y estadística.
          </p>
        </div>

        <div style={styles.featureCard}>
          <h2 style={styles.featureTitle}>Estructuras principales de Pandas:</h2>
          <ul style={styles.infoTextList}>
            <li><strong>Series:</strong> Una columna o vector de datos unidimensional con etiquetas (índices).</li>
            <li><strong>DataFrame:</strong> Una tabla bidimensional de filas y columnas, muy parecida a una tabla de Excel.</li>
            <li><strong>Limpieza de Datos:</strong> Herramientas inigualables para tratar valores nulos, duplicados y datos inconsistentes.</li>
            <li><strong>I/O Extenso:</strong> Lee y escribe datos de una variedad enorme de fuentes y formatos (CSV, Excel, SQL, JSON, Parquet, etc.).</li>
          </ul>
        </div>

      </div>
    </div>
  );
}

export default Home;
=======
import { Link } from "react-router-dom";

type Service = {
  to: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const services: Service[] = [
  {
    to: "/dashboard",
    title: "Pandas",
    description: "Carga un CSV y obtén resumen, tipos de dato y primeros registros al instante.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18M9 9v11" />
      </svg>
    ),
  },
  {
    to: "/dashboard",
    title: "NumPy",
    description: "Convierte tus tablas en arrays y calcula promedio, máximo y mínimo.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="6" height="6" rx="1" />
        <rect x="15" y="3" width="6" height="6" rx="1" />
        <rect x="3" y="15" width="6" height="6" rx="1" />
        <rect x="15" y="15" width="6" height="6" rx="1" />
      </svg>
    ),
  },
  {
    to: "/dashboard",
    title: "Reportes",
    description: "Revisa el historial de cada operación que ejecutaste, con hora y resultado.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 20V10M12 20V4M20 20v-7" />
      </svg>
    ),
  },
  {
    to: "/dashboard",
    title: "Imagen",
    description: "Clasifica imágenes en vivo desde tu cámara con un modelo entrenado en Teachable Machine.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="9" cy="10" r="2" />
        <path d="m21 16-5-5-4 4-3-3-6 6" />
      </svg>
    ),
  },
  {
    to: "/dashboard",
    title: "Audio",
    description: "Reconoce sonidos y comandos de voz analizando el micrófono en tiempo real.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 12h3l3-7 4 14 3-9 2 4h3" />
      </svg>
    ),
  },
  {
    to: "/dashboard",
    title: "Postura",
    description: "Detecta tu postura corporal frente a la cámara con un modelo de pose estimation.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v6M8 10l4 3 4-3M9 21l3-5 3 5" />
      </svg>
    ),
  },
];

function Home() {
  return (
    <div className="home">
      {/* ================= HERO ================= */}
      <section className="home-hero">
        <div>
          <span className="home-eyebrow">Proyecto React + TypeScript</span>

          <h1>
            De tu CSV a un <em>DataFrame</em>, y de ahí a un <em>ndarray</em>
            {" "}— directo en el navegador
          </h1>

          <p>
            Un laboratorio de datos que imita los flujos de trabajo de Pandas y NumPy,
            y suma modelos de Machine Learning para imagen, audio y postura corporal.
            Sin instalar Python, sin backend: todo corre aquí mismo.
          </p>

          <div className="home-hero-actions">
            <Link to="/dashboard" className="home-btn-primary">
              Ir al Dashboard →
            </Link>
            <Link to="/servicios" className="home-btn-secondary">
              Ver todos los servicios
            </Link>
          </div>
        </div>

        <div className="home-signature" aria-hidden="true">
          <div className="home-signature-bar">
            <span /><span /><span />
          </div>

          <table>
            <thead>
              <tr><th>id</th><th>producto</th><th>ventas</th></tr>
            </thead>
            <tbody>
              <tr><td>0</td><td>teclado</td><td>128</td></tr>
              <tr><td>1</td><td>monitor</td><td>64</td></tr>
              <tr><td>2</td><td>mouse</td><td>210</td></tr>
            </tbody>
          </table>

          <div className="home-signature-arrow">↓ df.to_numpy()</div>

          <div className="home-signature-array">
            array([[0, 128],
            <br />&nbsp;&nbsp;&nbsp;&nbsp;[1,&nbsp;&nbsp;64],
            <br />&nbsp;&nbsp;&nbsp;&nbsp;[2, 210]])<span className="home-signature-cursor" />
          </div>
        </div>
      </section>

      {/* ================= SERVICIOS ================= */}
      <section className="home-section">
        <div className="home-section-head">
          <h2>Explora cada módulo</h2>
          <p>
            Seis herramientas dentro de un mismo dashboard: dos para practicar operaciones
            de datos y tres modelos de IA entrenados con Teachable Machine.
          </p>
        </div>

        <div className="home-services-grid">
          {services.map((service) => (
            <Link key={service.title} to={service.to} className="home-service-card">
              <span className="home-service-icon">{service.icon}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className="home-service-link">Explorar →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= DOS COLUMNAS ================= */}
      <section className="home-section" style={{ paddingTop: 0 }}>
        <div className="home-split">
          <div className="home-split-block">
            <h3>100% en tu navegador</h3>
            <p>
              La lectura de CSV, el parseo y los cálculos estadísticos se ejecutan en el
              cliente con JavaScript puro — nada viaja a un servidor.
            </p>
          </div>

          <div className="home-split-block">
            <h3>IA lista para usar</h3>
            <p>
              Los modelos de imagen, audio y postura se entrenaron en Teachable Machine y
              se cargan directo desde <code>/public</code>, sin backend ni API keys.
            </p>
          </div>
        </div>
      </section>

      {/* ================= STACK ================= */}
      <section className="home-section" style={{ paddingTop: 0 }}>
        <div className="home-section-head" style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 20 }}>Construido con</h2>
        </div>

        <div className="home-stack">
          {["React", "TypeScript", "Vite", "React Router", "TensorFlow.js", "Teachable Machine"].map((tech) => (
            <span key={tech} className="home-chip">{tech}</span>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="home-section" style={{ paddingTop: 0 }}>
        <div className="home-cta">
          <div>
            <h2>¿Listo para explorar tus datos?</h2>
            <p>Carga un CSV o activa tu cámara y prueba los seis módulos del dashboard.</p>
          </div>

          <Link to="/dashboard" className="home-btn-primary">
            Empezar ahora →
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
>>>>>>> master
