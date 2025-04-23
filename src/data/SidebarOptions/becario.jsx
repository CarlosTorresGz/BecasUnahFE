import { MdEventAvailable, MdCheckCircle, MdDescription, MdSchool, MdPerson, MdAssignmentTurnedIn, MdAssignment, MdReceiptLong } from "react-icons/md";

export const optionBecario = [
    {
        title: 'Actividades',
        icon: <MdAssignmentTurnedIn className="panel-izq-button-icono" />,
        submenu: [
            {
                label: 'Disponibles',
                path: 'actividades-disponibles',
                icon: <MdEventAvailable className="panel-izq-button-icono" />
            },
            {
                label: 'Inscritas',
                path: 'actividades-inscritas',
                icon: <MdAssignment className="panel-izq-button-icono" />
            },
            {
                label: 'Realizadas',
                path: 'actividades-realizadas',
                icon: <MdCheckCircle className="panel-izq-button-icono" />
            },
        ],
    },
    {
        title: 'Reportes',
        icon: <MdReceiptLong className="panel-izq-button-icono" />,
        submenu: [
            {
                label: 'Reportes Recibidos',
                path: 'reportes/recibidos',
                icon: <MdDescription className="panel-izq-button-icono" />
            },
        ],
    },
    {
        title: 'Perfil',
        icon: <MdPerson className="panel-izq-button-icono" />,
        submenu: [
            {
                label: 'Mi Beca',
                path: 'mi-beca',
                icon: <MdSchool className="panel-izq-button-icono" />
            },
            {
                label: 'Mi Perfil',
                path: 'mi-perfil',
                icon: <MdPerson className="panel-izq-button-icono" />
            },
        ],
    },
];