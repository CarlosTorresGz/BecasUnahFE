import '../styles/Dashboard.css';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { DropdownMenu } from './DropdownMenuDashboard';
import { MdEventAvailable, MdCheckCircle, MdDescription, MdSchool, MdPerson, MdEventNote, MdAddTask, MdChecklist, MdHistory, MdPersonAdd, MdEdit } from "react-icons/md";
import { ProfileBecario } from './ProfileBecario';
import { MiBeca } from './MiBeca';
import ActividadesDisponibles from './ActividadesDisponibles';

// Importacion de datos de prueba para probar 
import { datosDePrueba } from '../testeos/MockDataActividadesDisponibles';

export const Dashboard = ({ userType }) => {
  const [activeComponent, setActiveComponent] = useState(null);

  const optionBecario = [
    {
      label: 'Actividades Disponibles',
      onClick: () => setActiveComponent('Actividades Disponibles'),
      icon: <MdEventAvailable className="panel-izq-button-icono" />
    },
    {
      label: 'Actividades Realizadas',
      onClick: () => setActiveComponent('Actividades Realizadas'),
      icon: <MdCheckCircle className="panel-izq-button-icono" />
    },
    {
      label: 'Reportes Recibidos',
      onClick: () => setActiveComponent('Reportes Recibidos'),
      icon: <MdDescription className="panel-izq-button-icono" />
    },
    {
      label: 'Mi Beca',
      onClick: () => setActiveComponent('Mi Beca'),
      icon: <MdSchool className="panel-izq-button-icono" />
    },
    {
      label: 'Mi Perfil',
      onClick: () => setActiveComponent('Bienvenido'),
      icon: <MdPerson className="panel-izq-button-icono" />
    }
  ];

  const optionAdmin = [
    {
      label: 'Actividades Disponibles',
      onClick: () => setActiveComponent('Actividades Disponibles'),
      icon: <MdEventNote className="panel-izq-button-icono" />
    },
    {
      label: 'Nueva Actividad',
      onClick: () => setActiveComponent('Ingreso de Nueva Actividad'),
      icon: <MdAddTask className="panel-izq-button-icono" />
    },
    {
      label: 'Revisión de Becas',
      onClick: () => setActiveComponent('Revisión de Becas'),
      icon: <MdChecklist className="panel-izq-button-icono" />
    },
    {
      label: 'Historial de Reportes',
      onClick: () => setActiveComponent('Historial de Reportes'),
      icon: <MdHistory className="panel-izq-button-icono" />
    },
    {
      label: 'Nuevo Becario',
      onClick: () => setActiveComponent('Nuevo Becario'),
      icon: <MdPersonAdd className="panel-izq-button-icono" />
    },
    {
      label: 'Modificar Becario',
      onClick: () => setActiveComponent('Modificar Becario'),
      icon: <MdEdit className="panel-izq-button-icono" />
    }
  ];

  const optionSidebar = userType === 'becario' ? optionBecario : userType === 'admin' ? optionAdmin : [];

  return (
    <>
      <div className='panel-superior'>
        <DropdownMenu optionDropdownMenu={optionSidebar} />
        <h1>{activeComponent ? activeComponent : "Plataforma Avanzada de Control de Horas PASEE"}</h1>
      </div>
      <div className="principal">
        <Sidebar optionSidebar={optionSidebar} />
        <div className="panel-der">
          <div className="panel-der-content">
            <div id='aquiContenido'>
              {(() => {
                switch (activeComponent) {
                  case 'Actividades Disponibles'://solo es de pruebas de momento
                    return <ActividadesDisponibles data={datosDePrueba.actividades} />;
                  case 'Bienvenido ':
                    return <ProfileBecario />;
                  case 'Mi Beca':
                    return <MiBeca />;
                  default:
                    return <p>Selecciona una opción</p>;
                }
              })()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
