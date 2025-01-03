import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../layouts/button';

import '../assets/styles/header.css';

interface HeaderProps {
  showSearch?: boolean;
  showTitle?: boolean;
  title?: string;
  showMenu?: boolean;
  showButton?: boolean;
}
const logoUrl = "https://firebasestorage.googleapis.com/v0/b/papilon-baa86.appspot.com/o/LineaGrafica%2FLOGO_PAPILON%20HORIZONTAL.png?alt=media&token=b9f4dd30-8ae4-4b03-909b-f0292c284e18";

const Header: React.FC<HeaderProps> = ({ showSearch = false, showTitle = false, title = "My Website", showMenu = true, showButton = true }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="" className="logo">
        <img src={logoUrl} alt='Logo' className="logo"/>
        </Link>
        {showMenu && (
          <button className="menu-toggle" onClick={toggleMenu}>
            ☰
          </button>
        )}

        {isMenuOpen && (
          <nav className="dropdown-menu">
            <Link to="/">Home</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/settings">Settings</Link>
          </nav>
        )}

        {showTitle && <h1 className="title">{title}</h1>}
      </div>

      <div className="header-right">
      {showSearch && (
        <div className="search-container">
          <input type="text" placeholder="Buscar..." className="search-input" />
        </div>
      )}
        {showButton && (<div className='btn-container'>
        <Button type="button" className="header login"> 
        <Link to="/login" className="btn-link">Ingresar</Link>
        </Button>
        <Button type="button" className="header"> 
        <Link to="/register" className="btn-link">Registrarse</Link>
        </Button>
        </div>)}
        
      </div>
    </header>
  );
};

export default Header;

    
