import { useState } from 'react';
import { MdMenu } from "react-icons/md";
import '../styles/Sidebar.css';
import { FaChevronDown } from "react-icons/fa";
import { dashboardPropTypes } from "../util/propTypes";

export const Sidebar = ({ optionSidebar }) => {
    const [expanded, setExpanded] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState({});

    const handleNavigation = () => {
        setExpanded(!expanded);
        setExpandedCategory({});
    };

    const toggleCategory = (index) => {
        setExpandedCategory((prev) => ({
            ...prev,
            [index]: !prev[index], // Alterna solo la categoría clickeada
        }));
    };

    return (
        <div className={`panel-izq ${expanded ? 'expanded' : ''}`}>
            <button className="panel-izq-toggle" onClick={handleNavigation}>
                <MdMenu />
                {expanded && <span className="panel-izq-button-text">Menú</span>}
            </button>
            {optionSidebar.map((option, index) => (
                <div key={index} className='panel-izq-category'>
                    <div className='panel-izq-category-title'>
                        <button className="panel-izq-toggle" onClick={() => toggleCategory(index)} title={option.title}>
                            {!expanded && option.icon}
                            {expanded && <h3 className='panel-izq-button-text' key={index}>{option.title} <FaChevronDown /> </h3>}
                        </button>
                    </div>
                    {expandedCategory[index] && (
                        <div className='panel-izq-category-clasification'>
                            {option.submenu.map((clasification, i) => (
                                <button className="panel-izq-button" key={i} onClick={clasification.onClick} title={clasification.label}>
                                    {clasification.icon}
                                    {expanded && <span className="panel-izq-button-text">{clasification.label}</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}

        </div>
    );
};

Sidebar.propTypes = dashboardPropTypes;
