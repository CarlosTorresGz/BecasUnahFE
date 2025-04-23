import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/auth/Button";
import { InputField } from "../components/auth/InputField";
import { AlertMessage } from "../components/auth/AlertMessage";
import "../styles/ChangePassword.css";
import EMAIL from "../img/EMAIL.svg";
import usePasswordValidator from "../hooks/usePasswordValidator";
import { changePassword } from "../services/userAPI";
import { toast } from 'sonner'

const ChangePassword = () => {
  const [correoInstitucional, setCorreoInstitucional] = useState("")
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  
  const { validatePassword, error } = usePasswordValidator();

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    validatePassword(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(newPassword)) return;

    if (newPassword !== confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      return;
    }

    const estadoActualizacion = await changePassword({ email: correoInstitucional, newPass: newPassword });

    if (estadoActualizacion.state) {
      //setMessage("Cambio de contraseña correcto");
      toast.success("Cambio de contraseña correcto");

      setCorreoInstitucional("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("")
    } else {
      setMessage("Ocurrio un error al cambiar la contraseña.");
      toast.error(estadoActualizacion.body);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="change-password-container">
      <div className="d-flex flex-column align-items-center bg-white change-password-content">
        <img src={EMAIL} alt="Email Logo" className="email-logo" />
        <div className="change-password-form text-center p-4">
          <h3 className="text-dark fs-6">Cambio de Contraseña</h3>
          {message && <AlertMessage message={message} />}
          {error && <AlertMessage message={error} />}
          <form onSubmit={handleSubmit} className="change-password-form">
            <InputField
              type="email"
              value={correoInstitucional}
              placeholder="Correo Institucional"
              onChange={(e) => setCorreoInstitucional(e.target.value)}
              className="custom-input"
            />
            <div style={{ position: 'relative' }}>
              <InputField
                type="password"
                value={newPassword}
                placeholder="Contraseña Nueva"
                onChange={handlePasswordChange}
                className="custom-input"
                isPassword={true}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <InputField
                type="password"
                value={confirmPassword}
                placeholder="Confirmar Contraseña Nueva"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="custom-input"
                isPassword={true}
              />
            </div>
            <div className="button-group">
              <Button
                type="submit"
                text="Guardar"
                className="boton-guardar"
              />
              <Button
                type="button"
                text="Regresar"
                className="boton-cancelar"
                onClick={handleBack}
              />
            </div>
          </form>
        </div>
      </div >
    </div >
  );
};

export default ChangePassword;
