import React, { useState, PropsWithChildren } from 'react'; // Asegúrate de incluir useState
import './navbarLayout.css';

const NavbarLayout: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Ahora useState funcionará correctamente

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="navbar-layout">
      <header className="navbar">
        <div className="navbar-left">
          <button className="menu-toggle" onClick={toggleMenu}>
            ☰
          </button>
          <img src="/logo.png" alt="Papilon Logo" className="logo" />
        </div>
        <div className="navbar-center">
          <input type="text" placeholder="Search" className="search-bar" />
        </div>
        <div className="navbar-right">
          <div className="notifications">
            <span className="notification-icon">🔔</span>
            <span className="notification-count">6</span>
          </div>
          <div className="language">
            <img src="/flags/uk.png" alt="English" className="language-icon" />
            <span>English</span>
          </div>
          <div className="profile">
            <img src="/profile-pic.jpg" alt="Profile" className="profile-pic" />
          </div>
        </div>
      </header>
      {isMenuOpen && (
        <div className="sidebar">
          <ul className="menu">
            <li>Estadísticas</li>
            <li>Catálogo Productos</li>
            <li>Catálogo Fidelización</li>
            <li>Datos del Local</li>
            <li>Ofertas</li>
            <li>Calificaciones y reseñas</li>
          </ul>
        </div>
      )}
      <main className="content">{children}</main>
    </div>
  );
};

export default NavbarLayout;
