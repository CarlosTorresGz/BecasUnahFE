import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : undefined;
    });

    // Revisar si hay un usuario guardado en el localStorage
    useEffect(() => {
        if (user === undefined) {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser)); // Cargar el usuario guardado
            }
        }
    }, [user]);

    const login = (studentData, callback) => {
        setUser(studentData); // Guardar datos del usuario autenticado
        console.log("Autenticación exitosa:", studentData);
        localStorage.setItem("user", JSON.stringify(studentData));
        localStorage.setItem('isLoggedIn', 'true');
        if (callback) callback();
    };

    const logout = () => {
        setUser(null); // Cerrar sesión
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userRole");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);
