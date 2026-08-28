import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <p className="footer-brand">
            Mi Proyecto <span>Python</span>
          </p>
          <p>
            Un dashboard construido con React y TypeScript para practicar Pandas,
            NumPy y modelos de Machine Learning directo en el navegador.
          </p>
        </div>

        <div className="footer-col">
          <h4>Navegación</h4>
          <Link to="/">Inicio</Link>
          <Link to="/nosotros">Nosotros</Link>
          <Link to="/servicios">Servicios</Link>
          <Link to="/contacto">Contacto</Link>
        </div>

        <div className="footer-col">
          <h4>Cuenta</h4>
          <Link to="/login">Iniciar sesión</Link>
          <Link to="/register">Crear cuenta</Link>
          <Link to="/dashboard">Ir al Dashboard</Link>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 Mi Proyecto Python — Todos los derechos reservados
      </div>
    </footer>
  );
}

export default Footer;
