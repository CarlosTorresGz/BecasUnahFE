import React, { useState } from "react";
import useLoginAttempts from "../../hooks/useLoginAttempts";
import { useAuth } from "../../context/AuthContext";
import { AlertMessage } from "./AlertMessage";
import { Button } from "./Button";
import { InputField } from "./InputField";
import { useNavigate } from "react-router-dom";

export const LoginForm = ({ ph = "No. Cuenta" }) => {
    const { login } = useAuth();
    const [noCuenta, setNoCuenta] = useState("");  
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();  // Hook para la navegación

    

    // Usa el hook useLoginAttempts
    const { attempts, locked, timeLeft, incrementAttempts } = useLoginAttempts();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
    
        if (locked) {
            setError(`Demasiados intentos fallidos. Espere ${timeLeft} segundos.`);
            return;
        }
    
        try {
            const response = await fetch("https://sl0vr31lxk.execute-api.us-east-1.amazonaws.com/dev/login", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ no_cuenta: noCuenta, contrasena: password }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || "Error en la autenticación");
            }
    
            login({ name: data.nombre, noCuenta });
            console.log("Autenticación exitosa:", data);
    
            // Si el usuario inicia sesión correctamente, restablecemos los intentos fallidos
            localStorage.removeItem("login_attempts");
            localStorage.removeItem("locked_until");
    
            navigate("/");

        } catch (err) {
            setError(err.message);
            incrementAttempts(); // Aumenta intentos si hay error
        }
    };
    

    return (
        <form onSubmit={handleSubmit}>
            {error && <AlertMessage message={error} />}
            <InputField
                type="number"
                value={noCuenta}
                placeholder={ph}
                onChange={(e) => setNoCuenta(e.target.value)}
                className="custom-input"
            />
            <InputField
                type="password"
                value={password}
                placeholder="Contraseña"
                onChange={(e) => setPassword(e.target.value)}
                className="custom-input"
            />
            <Button 
                type="submit" 
                text={locked ? `Espere ${timeLeft} segundos` : "Ingresar"} 
                className="custom-btn"
                disabled={locked} 
            />
        </form>
    );
};
