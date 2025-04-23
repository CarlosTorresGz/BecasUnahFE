import { createContext, useContext, useState, useEffect } from "react";
import obtenerUsuario from "../util/jwtDecoded";
import { iniciarSesionBecario, iniciarSesionEmployee } from '../services/userAPI';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    AuthProvider.propTypes = {
        children: PropTypes.node.isRequired,
    };

    const [user, setUser] = useState(() => {
        const storedUser = obtenerUsuario();
        return storedUser ? storedUser : undefined;
    });
    const [loadingUser, setLoadingUser] = useState(true);
    const [error, setError] = useState(null);

    // Verificar autenticación al cargar el provider
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                setLoadingUser(true);
                const token = localStorage.getItem('jwtToken');

                if (token) {
                    const storedUser = obtenerUsuario();
                    if (storedUser) {
                        setUser({
                            ...storedUser,
                            ultimoAcceso: new Date().toISOString()
                        });
                    }
                }
            } catch (error) {
                console.error('Error al verificar autenticación:', error);
                setError(error.message);
                logout();
            } finally {
                setLoadingUser(false);
            }
        };

        verifyAuth();
    }, []);

    const login = async ({ userType, username, password }) => {
        try {
            setLoadingUser(true);
            setError(null);
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

            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', userType);
            localStorage.setItem('user', JSON.stringify(authResult.data));
            setUser(authResult.data);

            return true;

        } catch (error) {
            console.error('[Auth] Error en login:', error);
            setError(error.message);
            return false;
        } finally {
            setLoadingUser(false);
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
        try {
            setLoadingUser(true);
            if (!token) {
                return Promise.reject(new Error('No hay token de autenticación'));
            }
        } finally {
            setLoadingUser(false);
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

    const getUser = () => {
        if (user) {
            return user;
        } else {
            setUser(obtenerUsuario());
            return user;
        }
    }

    return (
        <AuthContext.Provider value={{ getUser, login, logout, checkAuth, getPermissions, loadingUser, error }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);