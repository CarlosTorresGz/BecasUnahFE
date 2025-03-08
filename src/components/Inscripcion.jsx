import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import "../styles/Inscripcion.css";
import inscripcionActividad from "../services/inscripcionActividadAPI";
import { toast } from 'sonner';

const FormularioInscripcion = ({ actividad, onClose }) => {
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        cuenta: "",
        email: ""
    });
    const [errors, setErrors] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        if (e.target.name === "email") {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@unah\.hn$/;
            if (!emailRegex.test(e.target.value)) {
                setErrors((prev) => ({ ...prev, email: "Debe ser un correo de la UNAH (@unah.hn)" }));
            } else {
                setErrors((prev) => ({ ...prev, email: "" }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await inscripcionActividad({ actividadId: actividad.actividad_id, noCuenta: formData.cuenta });
        
        if (response.state) {
            toast.success(`${response.body}`);

            setFormData({
                nombre: "",
                apellido: "",
                cuenta: "",
                email: ""
            });

            onClose();
        } else {
            toast.info(`${response.body}`);
        }        
    };

    return (
        <div className="formulario-inscripcion">
            <div className="formulario-header d-flex align-items-center gap-3">
                <img
                    src={actividad.imagen}
                    alt={actividad.nombre_actividad}
                    style={{ width: "95px", height: "95px", margin: "12px" }}
                />
                <h2 className="mb-0">Inscripción en {actividad.nombre_actividad}</h2>
            </div>
            <Form onSubmit={handleSubmit} className="form-main">
                <span className="text-danger small">* Obligatorio</span>
                <Form.Group controlId="nombre">
                    <Form.Label>1. Nombre</Form.Label>
                    <Form.Text className="text-muted">
                        Escriba su primer nombre y segundo nombre así como aparece en su DNI. Ejemplo: Carlos Eduardo.
                    </Form.Text>
                    <Form.Control
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="apellido">
                    <Form.Label>2. Apellido</Form.Label>
                    <Form.Text className="text-muted">
                        Escriba su primer y segundo apellido, así como aparece en su DNI. Ejemplo: Pérez Pérez.
                    </Form.Text>
                    <Form.Control
                        type="text"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="cuenta">
                    <Form.Label>3. Número de Cuenta de la UNAH</Form.Label>
                    <Form.Text className="text-muted">
                        Escribir el número de cuenta que asignó la universidad al momento de inscribirse en la carrera. Ejemplo: 20201001876.
                    </Form.Text>
                    <Form.Control
                        type="text"
                        name="cuenta"
                        value={formData.cuenta}
                        onChange={handleChange}
                        maxLength={11}
                        required
                    />
                </Form.Group>
                {/*
                <Form.Group controlId="genero">
                    <Form.Label>4. Género</Form.Label>
                    <Form.Text className="text-muted">
                        Escribir su género. Masculino o Femenino.
                    </Form.Text>
                    <div className="d-flex gap-4 radio-buttons">
                        <Form.Check
                            type="radio"
                            label="Masculino"
                            name="genero"
                            value="Masculino"
                            checked={formData.genero === "Masculino"}
                            onChange={() => setFormData({ ...formData, genero: "Masculino" })}
                        />
                        <Form.Check
                            type="radio"
                            label="Femenino"
                            name="genero"
                            value="Femenino"
                            checked={formData.genero === "Femenino"}
                            onChange={() => setFormData({ ...formData, genero: "Femenino" })}
                        />
                    </div>
                </Form.Group>
                */}
                <Form.Group controlId="email">
                    <Form.Label>4. Correo electrónico de la UNAH</Form.Label>
                    <Form.Text className="text-muted">
                        Escribir el correo electrónico asignado por la universidad. Ejemplo: kargisshc@unah.hn
                    </Form.Text>
                    <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {errors.email && <p className="text-danger">{errors.email}</p>}
                </Form.Group>
                {/*
                <Form.Group controlId="carrera">
                    <Form.Label>6. Soy estudiante de la siguiente carrera</Form.Label>
                    <Form.Control
                        type="text"
                        name="carrera"
                        value={formData.carrera}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                */}
                <Button type="submit" variant="primary" className="w-20 mt-3">
                    Inscribirse
                </Button>
                <Button type="button" variant="secondary" className="w-20 mt-3 close-btn" onClick={onClose}>Volver</Button>
            </Form>
        </div>
    );
};

export default FormularioInscripcion;
