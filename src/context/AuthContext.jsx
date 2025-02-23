import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Revisar si hay un usuario guardado en el localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // Cargar el usuario guardado
        }
    }, []);

    const login = (studentData) => {
        setUser(studentData); // Guardar datos del usuario autenticado
        console.log("Autenticación exitosa:", studentData);
        localStorage.setItem("user", JSON.stringify(studentData)); // Guardar usuario
        localStorage.setItem('isLoggedIn', 'true'); // Guarda un valor booleano como string
    };

    const logout = () => {
        setUser(null); // Cerrar sesión
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userRole");
    };

    // Sincronizar el estado con localStorage al refrescar la página
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);
