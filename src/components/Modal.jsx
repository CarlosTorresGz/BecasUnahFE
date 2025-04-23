import '../styles/Modal.css';
import { ModalPropTypes } from "../util/propTypes";

const Modal = ({ isOpen, type, title, children, onConfirm, onCancel, }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">{title}</h2>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-footer">
                    <button
                        onClick={onCancel}
                        className="boton-cancelar"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={type === 'save' ? 'boton-guardar' : 'boton-confirmar'}
                    >
                        {type === 'save' ? 'Guardar' : 'Confirmar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

Modal.propTypes = ModalPropTypes;
export default Modal;