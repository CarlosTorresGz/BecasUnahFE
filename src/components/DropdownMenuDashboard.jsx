import '../styles/DropdownMenuDashboard.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { RxHamburgerMenu } from "react-icons/rx";

export const DropdownMenu = ({ optionDropdownMenu }) => {
  return (
    <Dropdown>
      <Dropdown.Toggle className='dropdown-menu-dashboard' variant="success" id="dropdown-basic">
        <RxHamburgerMenu />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {optionDropdownMenu.map((option, index) => (
          <Dropdown.Item key={index} onClick={option.onClick}>{option.label}</Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
