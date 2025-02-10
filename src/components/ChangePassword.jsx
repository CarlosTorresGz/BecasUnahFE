import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./auth/Button";
import { InputField } from "./auth/InputField";
import { AlertMessage } from "./auth/AlertMessage";
import "../styles/ChangePassword.css";
import EMAIL from "../img/EMAIL.svg";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      setMessage("Cambio de contraseña correcto");
    } else {
      setMessage("Las contraseñas no coinciden");
    }
  };

  const handleBack = () => {
    navigate("/login");
  };

  return (
    <div className="change-password-container">
      <div className="d-flex flex-column align-items-center bg-white change-password-content">
        <img src={EMAIL} alt="Email Logo" className="email-logo" />
        <div className="text-center p-4">
          <h3 className="text-dark fs-6">Cambio de Contraseña</h3>
          {message && <AlertMessage message={message} />}
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
              onChange={(e) => setNewPassword(e.target.value)}
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
