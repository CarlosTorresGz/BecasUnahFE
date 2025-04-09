import '../styles/CardActivity.css'
import { cardActivityPropTypes } from "../util/propTypes";
import { MdEdit, MdDelete } from "react-icons/md";

export const CardActivity = ({ data, userType, handleEdit, handleDeleteActivity, onClick }) => {
    return (
        <div className="actividades-list">
            {data && data.length > 0 ? (
                data.map((actividad) => (
                    <div key={actividad.actividad_id} className="actividad-box" onClick={() => onClick && onClick(actividad)}>
                        <img src={actividad.imagen} alt={actividad.nombre_actividad} className="actividad-imagen" />
                        <div className="actividad-info">
                            <h3>{actividad.nombre_actividad}</h3>
                            <p style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "250px"}}><strong>Organizador:</strong> {actividad.organizador}</p>
                            <p><strong>Fecha:</strong> {actividad.fecha_actividad}</p>
                            {userType === 'admin' && (
                                <p><strong>Estado de la Actividad: </strong> {actividad.estado_actividad}</p>
                            )}
                        </div>
                        {userType === 'admin' && (handleEdit || handleDeleteActivity) && (
                            <div className="actividad-botones">
                                {handleEdit && <button className="boton-editar" onClick={() => handleEdit(actividad)}><MdEdit /></button>}
                                {handleDeleteActivity && <button className="boton-borrar" onClick={() => handleDeleteActivity(actividad.actividad_id)}><MdDelete /></button>}
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>No hay actividades disponibles.</p>
            )}

        </div>
    );
}

CardActivity.propTypes = cardActivityPropTypes;
export default CardActivity;