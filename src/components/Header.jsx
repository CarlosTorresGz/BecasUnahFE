import React, { useState } from 'react';
import '../styles/Header.css';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <img src="logo1.png" alt="Logo 1" />
        <img src="logo2.png" alt="Logo 2" />
      </div>
      <nav className="nav">
        <ul className="nav-list">
          <li className="nav-item">Comunicados</li>
          <li className="nav-item">Becas</li>
          <li className="nav-item login" onClick={toggleDropdown}>
            Login
            <ul className={`dropdown ${isDropdownOpen ? 'open' : ''}`}>
              <li>Estudiantes</li>
              <li>Administradores</li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
