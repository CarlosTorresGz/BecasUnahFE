import '../styles/Dashboard.css';
import { Sidebar } from '../components/Sidebar';
import { DropdownMenu } from '../components/DropdownMenuDashboard';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import 'animate.css';
import { dashboardPropTypes } from "../util/propTypes";
import { getSidebarOptions } from '../data/SidebarOptions/index';

export const Dashboard = ({ userType }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const optionSidebar = getSidebarOptions(userType, (path) => {
    const prefix = userType === 'admin' ? 'administrador' : 'becario';
    navigate(`/dashboard/${prefix}/${path}`);
  });

  const getActiveComponent = () => {
    const path = location.pathname.split('/').pop();
    const map = {
      'actividades-disponibles': 'Actividades Disponibles',
      'actividades-inscritas': 'Actividades Inscritas',
      'actividades-realizadas': 'Actividades Realizadas',
      'mi-beca': 'Mi Beca',
      'mi-perfil': 'Mi Perfil',
      'recibidos': 'Reportes Recibidos',
      'actividades': 'Actividades Disponibles',
      'nueva-actividad': 'Nueva Actividad',
      'lista-asistencia': 'Lista de Asistencia',
      'seguimiento-beca': 'Seguimiento de Becas',
      'planilla': 'Planilla',
      'faq': 'Preguntas Frecuentes',
      'enviados': 'Reportes Enviados',
    };
    return map[path] || "Plataforma Avanzada de Control de Horas PASEE";
  };

  const activeComponent = getActiveComponent();

  return (
    <div className='content'>
      <div className='panel-superior'>
        <DropdownMenu optionDropdownMenu={optionSidebar} />
        <h1 className='animate__animated animate__bounceIn'>{activeComponent}</h1>
      </div>
      <div className="principal">
        <Sidebar optionSidebar={optionSidebar} />
        <div className="panel-der" id='aquiContenido'>
          <Outlet />
        </div>
      </div>
    </div>

  );
};

Dashboard.propTypes = dashboardPropTypes;
export default Dashboard;
