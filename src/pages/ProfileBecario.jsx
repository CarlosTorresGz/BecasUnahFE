import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfileBecario.css';
import { fetchPersonById } from '../services/personAPI';
import { useState, useEffect } from 'react';
import { fetchCareerById } from '../services/careerAPI';
import { InfoItem } from '../components/InformacionItem';
import { SpinnerLoading } from '../components/SpinnerLoading';
import { profilePropTypes } from "../util/propTypes";
import { toast } from 'sonner';



export const ProfileBecario = ({ setActiveComponent }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [persona, setPersona] = useState(null);
    const [carrera, setCarrera] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [noCuenta, setNoCuenta] = useState(null);
    const [ultimoAcceso, setUltimoAcceso] = useState(null);

    const cerrarSesion = () => {
        logout();
        toast.info('Sesión cerrada correctamente.')
        navigate('/')
    };

    const getData = async () => {
        const userLocal = JSON.parse(localStorage.getItem('user'));
        const persona_id = userLocal ? userLocal.persona_id : null;
        const carrera_id = userLocal ? userLocal.carrera_id : null;

        if (!userLocal) {
            console.error('No se encontró user en localStorage');
            setError('No se encontró la información del usuario.');
            setLoading(false);
            return;
        }

        try {
            const result = await fetchPersonById({ person_id: persona_id });
            const userCareer = await fetchCareerById({ career_id: carrera_id });
            const personData = result.body;

            if (result.state && userCareer.state) {
                setPersona(personData);
                setCarrera(userCareer.body)
                setNoCuenta(userLocal ? userLocal.no_cuenta : null);
                setUltimoAcceso(userLocal ? userLocal.ultimo_acceso : null);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error al obtener los datos de la persona:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    if (error) {
        return <div>Error al cargar los datos. Por favor, intenta de nuevo más tarde.</div>;
    }

    return (
        (loading) ? (
            <SpinnerLoading />
        ) : (
            <div className="profile-becario">
                <div className="profile-becario-header">
                    <img
                        className="profile-becario-photo"
                        src={`https://ui-avatars.com/api/?size=128&name=${persona ? `${persona.primer_nombre} ${persona.primer_apellido}` : "Usuario"}&background=003b74&color=FBFCF8&length=2&bold=true`}
                        alt={`${persona?.primer_nombre || "Usuario"}`}
                    />
                    <h2 className="profile-becario-name">
                        {`${persona.primer_nombre} ${persona.segundo_nombre} ${persona.primer_apellido} ${persona.segundo_apellido}`}</h2>
                </div>
                <div className="profile-becario-content">
                    <div className="profile-becario-info">
                        <InfoItem label='No. Cuenta:' value={noCuenta} />
                        <InfoItem label='Correo Institucional:' value={persona.correo_institucional} />
                        <InfoItem label='Carrera:' value={carrera} />
                        <InfoItem label='Último acceso al sistema:' value={ultimoAcceso} />
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