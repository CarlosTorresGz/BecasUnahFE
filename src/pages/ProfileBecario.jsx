import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfileBecario.css';
import { fetchPersonById } from '../services/PerfilBecario/personAPI';
import { useCallback, useEffect, useState } from 'react';
import { fetchCareerById } from '../services/PerfilBecario/careerAPI';
import { InfoItem } from '../components/InformacionItem';
import { SpinnerLoading } from '../components/SpinnerLoading';
import { profilePropTypes } from "../util/propTypes";
import { toast } from 'sonner';

export const ProfileBecario = ({ setActiveComponent }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [persona, setPersona] = useState(null);
    const [carrera, setCarrera] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dataProfileBecario = user || JSON.parse(localStorage.getItem('user'));

    const cerrarSesion = useCallback(() => {
        logout();
        toast.info('Sesión cerrada correctamente.')
        navigate('/')
    }, [logout, navigate]);

    const getData = useCallback(async () => {
        if (!dataProfileBecario?.persona_id || !dataProfileBecario?.carrera_id) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const [personResult, careerResult] = await Promise.all([
                fetchPersonById({ person_id: dataProfileBecario.persona_id }),
                fetchCareerById({ career_id: dataProfileBecario.carrera_id })
            ]);

            if (personResult.state && careerResult.state) {
                setPersona(personResult.body);
                setCarrera(careerResult.body);
            }
        } catch (error) {
            console.error('Error al obtener los datos de la persona:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [dataProfileBecario?.persona_id, dataProfileBecario?.carrera_id]);

    useEffect(() => {
        if (dataProfileBecario?.persona_id && dataProfileBecario?.carrera_id) {
            getData();
        } else {
            setLoading(false);
        }
    }, [getData]);

    if (error) {
        return <div>Error al cargar los datos. Por favor, intenta de nuevo más tarde.</div>;
    }

    const avatarName = persona ? `${persona.primer_nombre} ${persona.primer_apellido}` : "Usuario";
    const avatarUrl = `https://ui-avatars.com/api/?size=128&name=${avatarName}&background=003b74&color=FBFCF8&length=2&bold=true`;
    const nombreCompleto = persona
        ? `${persona.primer_nombre} ${persona.segundo_nombre} ${persona.primer_apellido} ${persona.segundo_apellido}`
        : "Usuario";

    return (
        (loading) ? (
            <SpinnerLoading />
        ) : (
            <div className="profile-becario">
                <div className="profile-becario-header">
                    <img
                        className="profile-becario-photo"
                        src={avatarUrl}
                        alt={`${persona?.primer_nombre || "Usuario"}`}
                    />
                    <h2 className="profile-becario-name">{nombreCompleto}</h2>
                </div>
                <div className="profile-becario-content">
                    <div className="profile-becario-info">
                        <InfoItem label='No. Cuenta:' value={dataProfileBecario.no_cuenta || 'No disponible'} />
                        <InfoItem label='Correo Institucional:' value={persona.correo_institucional || 'No disponible'} />
                        <InfoItem label='Carrera:' value={carrera} />
                        <InfoItem label='Último acceso al sistema:' value={dataProfileBecario.ultimoAcceso} />
                        <div className="profile-becario-action">
                            <button
                                className='profile-becario-buttom-blue'
                                onClick={() => {
                                    setActiveComponent('Mi Beca')
                                }}
                            > Mi Beca</button>
                            <button className='profile-becario-buttom-red' onClick={cerrarSesion}> Cerrar Sesión</button>
                        </div>
                    </div>
                </div>
            </div >
        )


    );

}


ProfileBecario.propTypes = profilePropTypes;