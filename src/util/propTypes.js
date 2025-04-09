import PropTypes from 'prop-types';

export const cardActivityPropTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        actividad_id: PropTypes.number.isRequired,
        imagen: PropTypes.string.isRequired,
        nombre_actividad: PropTypes.string.isRequired,
        descripcion: PropTypes.string.isRequired,
        organizador: PropTypes.string.isRequired,
        ubicacion: PropTypes.string.isRequired,
        fecha_actividad: PropTypes.string.isRequired,
        numero_horas: PropTypes.number.isRequired,
        estado_actividad: PropTypes.string.isRequired,
    })).isRequired,
    userType: PropTypes.string.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleDeleteActivity: PropTypes.func.isRequired,
    onClick: PropTypes.func,
};

export const dashboardPropTypes = {
    userType: PropTypes.string.isRequired,
    optionSidebar: PropTypes.array.isRequired,
    optionDropdownMenu: PropTypes.array.isRequired,
};

export const loginPropTypes = {
    userType: PropTypes.string.isRequired,
};

export const inputFieldPropTypes = {
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired,
    isPassword: PropTypes.bool.isRequired,
};

export const activityInscriptionPropTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        actividad_id: PropTypes.string.isRequired,
        imagen: PropTypes.string.isRequired,
        nombre_actividad: PropTypes.string.isRequired,
        descripcion: PropTypes.string.isRequired,
        organizador: PropTypes.string.isRequired,
        ubicacion: PropTypes.string.isRequired,
        fecha_actividad: PropTypes.string.isRequired,
        numero_horas: PropTypes.number.isRequired,
        estado_actividad: PropTypes.string.isRequired,
    })).isRequired,
    onClose: PropTypes.func.isRequired,
};

export const profilePropTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    setActiveComponent: PropTypes.func.isRequired,
};

export const tableReportPropTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        becario_id: PropTypes.string.isRequired,
        enlace: PropTypes.string.isRequired,
        fecha_reporte: PropTypes.string.isRequired,
        nombre_reporte: PropTypes.string.isRequired,
        observaciones: PropTypes.string.isRequired,
        reporte_id: PropTypes.string.isRequired,
        total_horas: PropTypes.number.isRequired,
    })).isRequired,
};

export const headerPropTypes = {
    textButton: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
};

export const searchBarPropTypes = {
    text: PropTypes.string.isRequired,
    searchTerm: PropTypes.string.isRequired,
    setSearchTerm: PropTypes.func.isRequired,
    onSearch: PropTypes.func
};

export const dashboardContextPropTypes = {
    children: PropTypes.node.isRequired,
    userType: PropTypes.string.isRequired,
};

export const ModalPropTypes = {
    isOpen: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};