import { useEffect, useState } from 'react';
import { handleTokenRefresh } from "../../services/Auth/handleTokenRefresh";
import { useAuth } from "../../context/AuthContext";
import PropTypes from 'prop-types';

const ListaDeBecarios = ({ onSelect }) => {
    const [becarios, setBecarios] = useState([]);
    const { getUser } = useAuth();
    let user = getUser();

    useEffect(() => {
        const fetchBecarios = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                console.warn('No se encontró token JWT');
                return { state: false, body: 'Autenticación requerida' };
            }

            const res = await fetch('http://localhost:7071/api/getUsers', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.status === 401) {
                return await handleTokenRefresh(fetchBecarios);
            }

            const data = await res.json();
            const otros = data.filter(b => b.no_cuenta !== user.no_cuenta);
            setBecarios(otros);
        };

        fetchBecarios();
    }, [user]);

    return (
        <div>
            <h2 className="text-lg font-semibold mb-2">Selecciona un becario para chatear</h2>
            <ul className="space-y-2">
                {becarios.map((b, idx) => (
                    <li key={idx}>
                        <button
                            onClick={() => onSelect(b.no_cuenta)}
                            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded w-full text-left"
                        >
                            {b.nombre_completo} ({b.no_cuenta})
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};


ListaDeBecarios.propTypes = {
    onSelect: PropTypes.func.isRequired,
};
export default ListaDeBecarios;
