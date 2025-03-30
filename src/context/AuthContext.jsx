import { createContext, useContext, useState } from "react";
import obtenerUsuario from "../util/jwtDecoded";
import { iniciarSesionBecario, iniciarSesionEmployee } from '../services/userAPI';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = obtenerUsuario();
        return storedUser ? storedUser : undefined;
    });

    const login = async ({ userType, username, password }) => {
        try {
            let authResult = null;

            if (userType === 'becario') {
                authResult = await iniciarSesionBecario({ noCuenta: username, password: password });
            } else if (userType === 'admin') {
                authResult = await iniciarSesionEmployee({ noEmpleado: username, password: password });
            } else {
                console.error('Tipo de usuario no reconocido: ', userType);
                return;
            }

            if (!authResult?.state) {
                return false;
            }

            const userData = obtenerUsuario();
            if (!userData) {
                console.error('No se pudieron obtener los datos del usuario');
                return false;
            }

            const sessionData = {
                ...userData,
                becario_id: userData.becario_id ? userData.becario_id.trim() : userData.becario_id,
                empleado_id: userData.empleado_id ? userData.empleado_id.trim() : userData.empleado_id,
                ultimoAcceso: new Date().toISOString()
            };

            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', userData.rol || userType);
            localStorage.setItem('user', JSON.stringify(sessionData));
            setUser(sessionData);

            return true;

        } catch (error) {
            console.error('Error en el proceso de login:', error);
            return false;
        }
    };

    const logout = () => {
        setUser(null); // Cerrar sesión
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userRole");
        localStorage.removeItem("jwtToken");
    };

    const checkAuth = () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            return Promise.reject(new Error('No hay token de autenticación'));
        }
        return Promise.resolve(token);
    };

    const getPermissions = () => {
        const role = localStorage.getItem('userRole');
        if (!role) {
            return Promise.reject(new Error('Rol no definido'));
        }
        return Promise.resolve(role);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, checkAuth, getPermissions }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);
