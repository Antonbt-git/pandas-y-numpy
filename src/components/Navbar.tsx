import { NavLink, Link } from "react-router-dom";

function Navbar() {

  return (
    <header className="navbar">
      <div className="container navbar-content">
        <h1 className="logo">Mi Proyecto Python</h1>

        <nav>
          <NavLink to="/">Inicio</NavLink>
          <NavLink to="/nosotros">Nosotros</NavLink>
          <NavLink to="/servicios">Servicios</NavLink>
          <NavLink to="/contacto">Contacto</NavLink>
        </nav>

        <Link to="/login" className="btn-login">
            Login
          </Link>

      </div>
    </header>
  );
}

export default Navbar;