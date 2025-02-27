import '../styles/Dashboard.css';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { DropdownMenu } from './DropdownMenuDashboard';
import { MdEventAvailable, MdCheckCircle, MdDescription, MdSchool, MdPerson, MdEventNote, MdAddTask, MdChecklist, MdHistory, MdEdit, MdLogout } from "react-icons/md";
import { ProfileBecario } from './ProfileBecario';
import { MiBeca } from './MiBeca';
import ActividadesDisponibles from './ActividadesDisponibles';
import AdminActividades from './AdminActividades';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

//Data de las actividades
import fetchAllData from '../services/ActAPI'
import fetchParcialData from '../services/ActAPIParcial'

const dataFetch = await fetchAllData();
const dataFetchBecarios = await fetchParcialData();

export const Dashboard = ({ userType }) => {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState(null);
  const { logout } = useAuth();

  const cerrarSesion = () => {
    logout();
    navigate('/');
};

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
      onClick: () => setActiveComponent('Bienvenido '),
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
      label: 'Modificar Becario',
      onClick: () => setActiveComponent('Modificar Becario'),
      icon: <MdEdit className="panel-izq-button-icono" />
    },
    {
      label: 'Cerrar Sesión',
      onClick: cerrarSesion,
      icon: <MdLogout className="panel-izq-button-icono" />
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
                  case 'Actividades Disponibles':
                    return userType === 'becario' 
                      ? <ActividadesDisponibles data={dataFetchBecarios.actividades} /> 
                      : <AdminActividades data={dataFetch.actividades} />;
                  case 'Bienvenido ':
                    return <ProfileBecario setActiveComponent={setActiveComponent}/>;
                  case 'Mi Beca':
                    return <MiBeca />;
                  default:
                    return userType === 'becario' 
                      ? <ActividadesDisponibles data={dataFetchBecarios.actividades} /> 
                      : <AdminActividades data={dataFetch.actividades} />;
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