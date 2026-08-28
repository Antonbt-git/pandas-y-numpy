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
