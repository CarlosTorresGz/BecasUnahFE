import { useState } from 'react';
import { MdMenu, MdOutlineChecklist, MdDashboard } from "react-icons/md";
import '../css/Sidebar.css';

export const Sidebar = ({optionSidebar}) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={`panel-izq ${expanded ? 'expanded' : ''}`}>
            <button className="panel-izq-toggle" onClick={() => setExpanded(!expanded)}>
                <MdMenu />
            </button>
            {optionSidebar.map((option, index) => (
                <button className="panel-izq-button" key={index} onClick={option.onclick}>
                    {option.icon}
                    {expanded && <span className="panel-izq-button-text">{option.label}</span>}
                </button>
            ))}
        </div>
    );
};
