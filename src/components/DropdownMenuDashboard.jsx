import '../styles/Dashboard.css';
import Dropdown from 'react-bootstrap/Dropdown';

export default function DropdownMenu() {
  return (
    <Dropdown>
      <Dropdown.Toggle className='dropdown-menu-dashboard' variant="success" id="dropdown-basic">
        Menú
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">Actividades</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Mis actividades</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Reportes</Dropdown.Item>
        <Dropdown.Item href="#/action-4">Mi Beca</Dropdown.Item>
        <Dropdown.Item href="#/action-5">Mi Perfil</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
