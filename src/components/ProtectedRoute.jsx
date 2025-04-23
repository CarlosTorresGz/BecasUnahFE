import { Navigate } from 'react-router-dom';
import { ProtectedRoutePropTypes } from "../util/propTypes";
import { LuShieldAlert } from "react-icons/lu";
import '../styles/ProtectedRoute.css';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const navigate = useNavigate();
    const userRol = localStorage.getItem('userRole');

    if (!userRol) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(userRol)) {
        return (
            <div className="access-denied-container">
                <div className="access-denied-card">
                    <div className="access-denied-header">
                        <div className="access-denied-icon">
                            <LuShieldAlert size={50} />
                        </div>
                    </div>
                    <div className="access-denied-body">
                        <h1 className="access-denied-title">Acceso Denegado</h1>
                        <p className="access-denied-message">
                            No tienes permisos para acceder a esta página.
                        </p>
                        <div className="access-denied-options">
                            {userRol === 'becario' ?
                                <button onClick={() => navigate('/dashboard/becario')} className="access-denied-button">
                                    Regresar
                                </button>
                                :
                                <button onClick={() => navigate('/dashboard/administrador')} className="access-denied-button">
                                    Regresar
                                </button>
                            }
                        </div>
                    </div>
                    <div className="access-denied-footer">
                        <p className="access-denied-message">
                            Si cree que se trata de un error, póngase en contacto con el administrador del sistema o con el equipo de soporte para obtener ayuda.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    return children;
};

ProtectedRoute.propTypes = ProtectedRoutePropTypes;
export default ProtectedRoute;