import Dropdown from 'react-bootstrap/Dropdown';
import { FaChevronDown } from "react-icons/fa";

function DropdownButton( {textButton, items} ) {
    return (
        <Dropdown>
            <Dropdown.Toggle className='barra-navegacion-button'>
                {textButton} <FaChevronDown />
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {items.map((item, index) => (
                    <Dropdown.Item
                        key={index}
                        onClick={item.onClick}
                    >
                        {item.label}
                    </Dropdown.Item>

                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default DropdownButton;