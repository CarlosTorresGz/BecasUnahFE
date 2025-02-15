import '../css/dashboard.css';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import ActividadesDisponibles from './ActividadesDisponibles';
import MisActividades from './MisActividades';
import PerfilBecario from './PerfilBecario';
import DropdownMenu from './DropdownMenu';
import { MdEventAvailable, MdCheckCircle, MdDescription, MdSchool, MdPerson, MdEventNote, MdAddTask, MdChecklist, MdHistory, MdPersonAdd, MdEdit } from "react-icons/md";

export const Dashboard = ({ userType }) => {
    const [activeComponent, setActiveComponent] = useState(null);
    const optionBecario = [
        {
            label: 'Actividades Disponibles',
            onclick: () => setActiveComponent('actividades'),
            icon: <MdEventAvailable className="panel-izq-button-icono"/>
        },
        {
            label: 'Actividades Realizadas',
            onclick: () => setActiveComponent('misActividades'),
            icon: <MdCheckCircle className="panel-izq-button-icono"/>
        },
        {
            label: 'Reportes',
            onclick: () => setActiveComponent('reportes'),
            icon: <MdDescription className="panel-izq-button-icono"/>
        },
        {
            label: 'Mi Beca',
            onclick: () => setActiveComponent('beca'),
            icon: <MdSchool className="panel-izq-button-icono"/>
        },
        {
            label: 'Mi Perfil',
            onclick: () => setActiveComponent('perfil'),
            icon: <MdPerson className="panel-izq-button-icono"/>
        }
    ];
    const optionAdmin = [
        {
            label: 'Actividades Disponibles',
            onclick: () => setActiveComponent('actividades'),
            icon: <MdEventNote className="panel-izq-button-icono"/>
        },
        {
            label: 'Nueva Actividad',
            onclick: () => setActiveComponent('nuevaActividad'),
            icon: <MdAddTask className="panel-izq-button-icono"/>
        },
        {
            label: 'Revisión de Becas',
            onclick: () => setActiveComponent('reportes'),
            icon: <MdChecklist className="panel-izq-button-icono"/>
        },
        {
            label: 'Historial de Reportes',
            onclick: () => setActiveComponent('beca'),
            icon: <MdHistory className="panel-izq-button-icono" />
        },
        {
            label: 'Nuevo Becario',
            onclick: () => setActiveComponent('nuevoBecario'),
            icon: <MdPersonAdd className="panel-izq-button-icono"/>
        },
        {
            label: 'Modificar Becario',
            onclick: () => setActiveComponent('modificarBecario'),
            icon: <MdEdit className="panel-izq-button-icono"/>
        }
    ];
    const optionSidebar = userType === 'becario' ? optionBecario : optionAdmin;

    return (
        <>
            <div className='panel-superior'>
                <DropdownMenu />
                <h1>Preguntas Frecuentes</h1>
            </div>
            <div className="principal">
                <Sidebar optionSidebar={optionSidebar} />
                <div className="panel-der">
                    <div className="panel-der-content">
                        <div id='aquiContenido'>
                            {(() => {
                                /* Aqui se renderiza el componente activo */
                                /*
                                switch (activeComponent) {
                                    case 'actividades': return <ActividadesDisponibles />;
                                    case 'misActividades': return <MisActividades />;
                                    case 'perfil': return <PerfilBecario />;
                                    case 'reportes': return <Reportes />;
                                    case 'beca': return <MiBeca />;
                                    case 'nuevaActividad': return <NuevaActividad />;
                                    case 'nuevoBecario': return <NuevoBecario />;
                                    case 'modificarBecario': return <ModificarBecario />;
                                    default: return <p>Selecciona una opción</p>;
                                }*/
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;