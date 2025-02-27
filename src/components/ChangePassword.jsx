import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./auth/Button";
import { InputField } from "./auth/InputField";
import { AlertMessage } from "./auth/AlertMessage";
import "../styles/ChangePassword.css";
import EMAIL from "../img/EMAIL.svg";
import usePasswordValidator from "../hooks/usePasswordValidator";
import { changePassword } from "../services/userAPI";
import { toast } from 'sonner'
import { LuEye } from "react-icons/lu";
import { LuEyeClosed } from "react-icons/lu";


const ChangePassword = () => {
  const [correoInstitucional, setCorreoInstitucional] = useState("")
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // Estado separado para cada input
  const [newPasswordType, setNewPasswordType] = useState('password');
  const [newPasswordIcon, setNewPasswordIcon] = useState(<LuEyeClosed size={25} />);
  const [confirmPasswordType, setConfirmPasswordType] = useState('password');
  const [confirmPasswordIcon, setConfirmPasswordIcon] = useState(<LuEyeClosed size={25} />);

  const navigate = useNavigate();

  const handleToggleNewPass = () => {
    if (newPasswordType === 'password') {
      setNewPasswordIcon(<LuEye size={25} />);
      setNewPasswordType('text');
    } else {
      setNewPasswordIcon(<LuEyeClosed size={25} />);
      setNewPasswordType('password');
    }
  };

  const handleToggleConfirmNewPass = () => {
    if (confirmPasswordType === 'password') {
      setConfirmPasswordIcon(<LuEye size={25} />);
      setConfirmPasswordType('text');
    } else {
      setConfirmPasswordIcon(<LuEyeClosed size={25} />);
      setConfirmPasswordType('password');
    }
  };
  
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

    // Aquí iría la lógica para enviar la nueva contraseña al backend
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
                type={newPasswordType}
                value={newPassword}
                placeholder="Contraseña Nueva"
                onChange={handlePasswordChange}
                className="custom-input"
              />
              <span className="flex icon-pass" onClick={handleToggleNewPass}>
                {newPasswordIcon}
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <InputField
                type={confirmPasswordType}
                value={confirmPassword}
                placeholder="Confirmar Contraseña Nueva"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="custom-input"
              />
              <span className="flex icon-pass" onClick={handleToggleConfirmNewPass}>
                {confirmPasswordIcon}
              </span>
            </div>
            <div className="button-group">
              <Button
                type="submit"
                text="Guardar"
                className="custom-btn-save"
              />
              <Button
                type="button"
                text="Regresar"
                className="custom-btn yellow-btn"
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
