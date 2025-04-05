import '../styles/DropdownMenuDashboard.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { RxHamburgerMenu } from "react-icons/rx";
import { dashboardPropTypes } from "../util/propTypes";

export const DropdownMenu = ({ optionDropdownMenu }) => {
  return (
    <Dropdown>
      <Dropdown.Toggle className='dropdown-menu-dashboard' variant="success" id="dropdown-basic">
        <RxHamburgerMenu />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {optionDropdownMenu.map((option, index) => (          
            option.submenu.map((categoria, i) => (
              index === 0 ? (
                <Dropdown.Item key={i} onClick={categoria.onClick}>{option.title} {categoria.label}</Dropdown.Item>
              ) : (
                <Dropdown.Item key={i} onClick={categoria.onClick}>{categoria.label}</Dropdown.Item>
              )              
            ))
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

DropdownMenu.propTypes = dashboardPropTypes;