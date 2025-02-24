import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfileBecario.css';
import { fetchPersonById } from '../services/personAPI';
import { useState, useEffect } from 'react';
import { fetchCareerById } from '../services/careerAPI';
import Spinner from 'react-bootstrap/Spinner';

export const InfoItem = ({ label, value }) => {
    return (
        <div className="profile-becario-info-item">
            <span className="profile-becario-info-item-label">{label} </span>
            <span className="profile-becario-info-item-value">{value}</span>
        </div>
    )
}

export const ProfileBecario = ({ setActiveComponent }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [persona, setPersona] = useState(null);
    const [carrera, setCarrera] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cerrarSesion = () => {
        logout();
        navigate('/')
    };

    // Obtener datos de la persona al cargar el componente
    useEffect(() => {
        const fetchPersonData = async () => {
            if (user && user?.persona_id && user?.carrera_id) {
                try {
                    console.log('Fetching data for persona_id:', user.persona_id);
                    const personData = await fetchPersonById({ person_id: user.persona_id });
                    const userCareer = await fetchCareerById({ career_id: user.carrera_id });
                    
                    if (personData.state && userCareer.state) {
                        setPersona(personData.body);
                        setCarrera(userCareer.body)
                    }
                } catch (error) {
                    console.error('Error al obtener los datos de la persona:', error);
                    setError(error);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (user !== undefined) {
            fetchPersonData();
        }
    }, [user]);

    if (user === undefined || loading || !user) {
        return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Spinner animation="border" role="status" style={{color:"#20527E"}}>
                <span className="visually-hidden" style={{color:"#20527E"}}>Loading...</span>
            </Spinner>

        </div>
        );
    }

    if (error) {
        return <div>Error al cargar los datos. Por favor, intenta de nuevo más tarde.</div>;
    }

    return (
        <div className="profile-becario">
            <div className="profile-becario-header">
                <img
                    className="profile-becario-photo"
                    src={`https://ui-avatars.com/api/?size=128&name=${persona ? `${persona.primer_nombre} ${persona.primer_apellido}` : "Usuario"}&background=20527E&color=FFF&length=2&bold=true`}
                    alt={`${persona?.primer_nombre || "Usuario"}`}
                />
                <h2 className="profile-becario-name">
                    {`${persona.primer_nombre} ${persona.segundo_nombre} ${persona.primer_apellido} ${persona.segundo_apellido}`}</h2>
            </div>
            <div className="profile-becario-content">
                <div className="profile-becario-info">
                    <InfoItem label='No. Cuenta:' value={user.no_cuenta} />
                    <InfoItem label='Correo Institucional:' value={persona.correo_institucional} />
                    <InfoItem label='Carrera:' value={carrera} />
                    <InfoItem label='Último acceso al sistema:' value={user.ultimo_acceso} />
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

    );

}