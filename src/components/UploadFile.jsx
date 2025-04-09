import {useState} from 'react'
import '../styles/UploadFile.css'
import { UploadFilePropTypes } from "../util/propTypes";

export const UploadFile = ({ handleChangeImage, imagen, nombreActividad }) => {
    const [dragging, setDragging] = useState(false);

    const handleDragOver = (event) => {
        event.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragging(false);
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleChangeImage({ target: { files: [file] } });
        }
    };

    return (
        <form 
            className={`form-upload-file ${dragging ? 'dragging' : ''}`} 
            onDragOver={handleDragOver} 
            onDragLeave={handleDragLeave} 
            onDrop={handleDrop}
        >
            <span className="form-title">Cambiar Imagen</span>
            <img src={imagen} alt={nombreActividad} className="actividad-imagen-admin" />
            <label htmlFor="file-input" className="drop-container">
                <span className="drop-title">Drop files here</span>
                or
                <input type="file" accept="image/*" required="" id="file-input" onChange={handleChangeImage} />
            </label>
        </form>
    )
}

UploadFile.propTypes = UploadFilePropTypes;
export default UploadFile
