import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/Header.css';
import '../../styles/ButtonsHeader.css';
import VOAE from '../../img/VOAE.png';
import UNAH from '../../img/UNAH.png';
import DropdownButton from './ButtonsHeader';
import { RxHamburgerMenu } from "react-icons/rx";
import { FaChevronDown } from "react-icons/fa";
import '../../styles/DropdownMenuDashboard.css';

function ButtonBarraNavegacion({ text, onClick }) {
  return (
    <button
      className="barra-navegacion-button"
      onClick={onClick}>
      {text}
    </button>
  );
}

/* Menu Movil */
function MenuNavegacion() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setIsDropdownOpen(false); // Cierra el menú principal
    setIsLoginOpen(false); // Cierra el menú de login
  };

  return (
    <nav className="nav-menu">
      <button className='menu-button' onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <RxHamburgerMenu />
      </button>
      <ul className={`nav-list ${isDropdownOpen ? 'open' : ''}`}>
        <li className="nav-item" onClick={() => handleNavigation("/comunicados")}>Comunicados</li>
        <li className="nav-item" onClick={() => handleNavigation("/tipo-becas")}>Becas</li>
        <li className="nav-item login"
          onClick={() => setIsLoginOpen(!isLoginOpen)}
          aria-expanded={isLoginOpen} >
          Ingresar <FaChevronDown />
          <ul className={`dropdown-login ${isLoginOpen ? 'open' : ''}`}>
            <li onClick={() => handleNavigation("/login")}>Estudiantes</li>
            <li onClick={() => handleNavigation("/login/employee")}>Administradores</li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}

const Header = () => {
  const navigate = useNavigate();

  const opciones = [
    { label: 'Administrador', onClick: () => navigate('/login/employee') },
    { label: 'Becario', onClick: () => navigate('/login') }
  ];

  return (
    <header className="header">
      <MenuNavegacion />
      <div className="logo">
        <Link to="/">
          <img src={VOAE} alt="Logo 1" />
          <img src={UNAH} alt="Logo 2" />
        </Link>
      </div>
      <div className='barra-navegacion-enlaces'>
        <ButtonBarraNavegacion text='Comunicados' onClick={() => navigate('/comunicados')} />
        <ButtonBarraNavegacion text='Becas' onClick={() => navigate('/tipo-becas')} />
        <DropdownButton textButton='Ingresar' items={opciones} />
      </div>
    </header>
  );
};

export default Header;