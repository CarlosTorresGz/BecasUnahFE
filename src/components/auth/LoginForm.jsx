import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { AlertMessage } from "./AlertMessage";
import { Button } from "./Button";
import { InputField } from "./InputField";

export const LoginForm = ({ ph = "No. Cuenta" }) => {
    const { login } = useAuth();
    const [noCuenta, setNoCuenta] = useState("");  // Cambiado de email a noCuenta
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Limpiar errores previos

        try {
            const response = await fetch("https://sl0vr31lxk.execute-api.us-east-1.amazonaws.com/dev/login", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ no_cuenta: noCuenta, contrasena: password }),  // Enviar no_cuenta en lugar de email
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error en la autenticación");
            }

            login({ name: data.nombre, noCuenta }); // Guardar usuario con noCuenta
            console.log("Autenticación exitosa:", data);
            
            // Redirigir a Google después de una autenticación exitosa
            window.location.href = "https://www.google.com"; 
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <AlertMessage message={error} />}
            <InputField
                type="number"
                value={noCuenta}  // Cambiado de email a noCuenta
                placeholder={ph}
                onChange={(e) => setNoCuenta(e.target.value)}  // Cambiado setEmail → setNoCuenta
                className="custom-input"
            />
            <InputField
                type="password"
                value={password}
                placeholder="Contraseña"
                onChange={(e) => setPassword(e.target.value)}
                className="custom-input"
            />
            <Button type="submit" text="Ingresar" className="custom-btn" />
        </form>
    );
};
