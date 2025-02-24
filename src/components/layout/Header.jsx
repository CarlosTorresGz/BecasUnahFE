import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/Header.css';
import VOAE from '../../img/VOAE.png';
import UNAH from '../../img/UNAH.png';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => !prevState);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest('.login')) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={VOAE} alt="Logo 1" />
        </Link>
        <img src={UNAH} alt="Logo 2" />
      </div>
      <nav className="nav">
        <ul className="nav-list">
          <li className="nav-item">Comunicados</li>
          <li className="nav-item" onClick={() => navigate("/tipo-becas")}>Becas</li>
          <li className="nav-item login" onClick={toggleDropdown} aria-expanded={isDropdownOpen}>
            Login
            <ul className={`dropdown-login ${isDropdownOpen ? 'open' : ''}`}>
              <li onClick={() => navigate("/login")}>Estudiantes</li>
              <li onClick={() => navigate("/login/employee")}>Administradores</li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
