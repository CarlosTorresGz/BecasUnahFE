import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./auth/Button";
import { InputField } from "./auth/InputField";
import { AlertMessage } from "./auth/AlertMessage";
import "../styles/ChangePassword.css";
import EMAIL from "../img/EMAIL.svg";
import usePasswordValidator from "../hooks/usePasswordValidator";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener el origen ("/login" o "/login/employee") desde la URL
  const searchParams = new URLSearchParams(location.search);
  const from = searchParams.get("from") || "/login"; // Si no hay parámetro, ir a "/login"

  const { validatePassword, error } = usePasswordValidator();

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    validatePassword(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validatePassword(newPassword)) return;

    if (newPassword !== confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      return;
    }
    
    setMessage("Cambio de contraseña correcto");
    // Aquí iría la lógica para enviar la nueva contraseña al backend
    
  };

  const handleBack = () => {
    navigate(from);
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
              placeholder="Correo Institucional"
              className="custom-input"
            />
            <InputField
              type="password"
              value={newPassword}
              placeholder="Contraseña Nueva"
              onChange={handlePasswordChange}
              className="custom-input"
            />
            <InputField
              type="password"
              value={confirmPassword}
              placeholder="Confirmar Contraseña Nueva"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="custom-input"
            />
            <div className="button-group">
              <Button
                type="submit"
                text="Guardar"
                className="custom-btn"
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
      </div>
    </div>
  );
};

export default ChangePassword;
