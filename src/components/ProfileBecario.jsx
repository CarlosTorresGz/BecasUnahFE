import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfileBecario.css';

const carreras = {
    carrera_id: 'CAR19',
    nombre_carrera: 'Ingeniería en Sistemas', //usado
    facultad_id: 'FAC04'
}

const persona = {
    persona_id: 0,
    primer_nombre: 'Rodrigo', //usado
    segundo_nombre: 'Eliezer', //usado
    primer_apellido: 'Fúnes', //usado
    segundo_apellido: 'Enríquez', //usado
    fecha_nacimiento: '2000-06-26',
    dni: '0801-2000-86954',
    sexo: 'M',
    estado_civil_id: 0,
    telefono: '3377-3942',
    correo_institucional: 'rodrigo.funes@unah.hn', //usado
}

const becario = {
    becario_id: 'B0',
    persona_id: 0,
    no_cuenta: '20171001103', //usado
    carrera_id: 'CAR19',
    beca_id: 0,
    estado_beca_id: 0,
    fecha_inicio_beca: '2023-01-01', //date
    contrasena: '1234',
    ultimo_acceso: '2024-01-01 00:00:00.000', //datetime - usado
    primer_ingreso: 1
}

export const InfoItem = ({ label, value }) => {
    return (
        <div className="profile-becario-info-item">
            <span className="profile-becario-info-item-label">{label} </span>
            <span className="profile-becario-info-item-value">{value}</span>
        </div>
    )
}

export const ProfileBecario = () => {
    //const { login } = useAuth();
    const navigate = useNavigate();

    const logout = () => {
        //login({ name: null, noCuenta: null });
        navigate('/')
    };

    return (
        <div className="profile-becario">
            <div className="profile-becario-header">
                <img className="profile-becario-photo"
                    src={`https://ui-avatars.com/api/?size=128&name=${persona ? `${persona.primer_nombre} ${persona.primer_apellido}` : "Usuario"
                        }&background=20527E&color=FFF&length=2&bold=true`}
                    alt={`${persona.primer_nombre}`}
                />
                <h2 className="profile-becario-name">{`${persona.primer_nombre} ${persona.segundo_nombre} ${persona.primer_apellido} ${persona.segundo_apellido}`}</h2>
            </div>
            <div className="profile-becario-content">
                <div className="profile-becario-info">
                    <InfoItem label='No. Cuenta:' value={becario.no_cuenta} />
                    <InfoItem label='Correo Institucional:' value={persona.correo_institucional} />
                    <InfoItem label='Carrera:' value={carreras.nombre_carrera} />
                    <InfoItem label='Último acceso al sistema:' value={becario.ultimo_acceso} />
                    <div className="profile-becario-action">
                        <button className='profile-becario-buttom-blue' > Mi Beca</button>
                        <button className='profile-becario-buttom-red' onClick={logout}> Cerrar Sesión</button>
                    </div>
                </div>
            </div>
        </div>
    );

}