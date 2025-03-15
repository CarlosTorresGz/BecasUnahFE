import { useState, useRef  } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { FaChevronDown } from "react-icons/fa";
import { headerPropTypes } from "../../util/propTypes";

function DropdownButton({ textButton, items }) {
    const [show, setShow] = useState(false);
    const timeoutRef = useRef(null);

    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
        setShow(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setShow(false);
        }, 500);
    };

    const handleClick = (onClick) => {
        onClick();
        setShow(false);
    };

    return (
        <Dropdown
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            show={show}
        >
            <Dropdown.Toggle className='barra-navegacion-button'>
                {textButton} <FaChevronDown />
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {items.map((item, index) => (
                    <Dropdown.Item className='dropdown-item-header'
                        key={index}
                        onClick={() => handleClick(item.onClick)}
                    >
                        {item.label}
                    </Dropdown.Item>

                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}

DropdownButton.propTypes = headerPropTypes;
export default DropdownButton;