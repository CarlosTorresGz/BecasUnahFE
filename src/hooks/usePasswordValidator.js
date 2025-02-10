import { useState } from "react";

const usePasswordValidator = () => {
  const [error, setError] = useState("");

  const validatePassword = (password) => {
    if (password.length < 10 && password.length > 0) {
      setError("Debe tener al menos 10 caracteres.");
      return false;
    }
    if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password) && password.length > 0) {
      setError("Debe contener letras y números.");
      return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password) && password.length > 0) {
      setError("Debe incluir al menos un carácter especial.");
      return false;
    }

    setError(""); // Si pasa todas las validaciones, borra el error
    return true;
  };

  return { validatePassword, error };
};

export default usePasswordValidator;
