import { MdEventNote, MdAddTask, MdChecklist, MdHistory, MdLogout, MdSummarize, MdPeopleAlt } from "react-icons/md";
import { MdHelpOutline } from 'react-icons/md';

export const optionAdmin = [
    {
        title: 'Actividades',
        icon: <MdEventNote className="panel-izq-button-icono" />,
        submenu: [
            {
                label: 'Actividades Disponibles',
                path: 'actividades',
                icon: <MdEventNote className="panel-izq-button-icono" />
            },
            {
                label: 'Nueva Actividad',
                path: 'nueva-actividad',
                icon: <MdAddTask className="panel-izq-button-icono" />
            },
            {
                label: 'Lista de Asistencia',
                path: 'lista-asistencia',
                icon: <MdChecklist className="panel-izq-button-icono" />
            },
        ],
    },
    {
        title: 'Reportes',
        icon: <MdSummarize className="panel-izq-button-icono" />,
        submenu: [
            {
                label: 'Revisión de Becas',
                path: 'seguimiento-beca',
                icon: <MdChecklist className="panel-izq-button-icono" />
            },
            {
                label: 'Historial de Reportes',
                path: 'reportes/enviados',
                icon: <MdHistory className="panel-izq-button-icono" />
            },
        ],
    },
    {
        title: 'Gestión de Becarios',
        icon: <MdPeopleAlt className="panel-izq-button-icono" />,
        submenu: [
            {
                label: 'Planilla',
                path: 'planilla',
                icon: <MdSummarize className="panel-izq-button-icono" />
            },
        ],
    },
    {
        title: 'FAQ',
        icon: <MdHelpOutline className="panel-izq-button-icono" />,
        submenu: [
            {
                label: 'Preguntas Frecuentes',
                path: 'faq',
                icon: <MdHelpOutline className="panel-izq-button-icono" />,
            },
        ],
    },
    {
        title: 'Cerrar Sesión',
        icon: <MdLogout className="panel-izq-button-icono" />,
        submenu: [
            {
                label: 'Cerrar Sesión',
                onClick: '',
                icon: <MdLogout className="panel-izq-button-icono" />
            },
        ],
    }
];