import React, { useState } from 'react';
import '../../styles/Header.css';
import VOAE from '../../img/VOAE.png' ;
import UNAH from '../../img/UNAH.png' ;
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <img src= {VOAE} alt="Logo 1" />
        <img src= {UNAH} alt="Logo 2" />
      </div>
      <nav className="nav">
        <ul className="nav-list">
          <li className="nav-item">Comunicados</li>
          <li className="nav-item">Becas</li>
          <li className="nav-item login" onClick={toggleDropdown}>
            Login
            <ul className={`dropdown ${isDropdownOpen ? 'open' : ''}`}>
              <li onClick={() => navigate("/login")}>Estudiantes</li>
              <li>Administradores</li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
