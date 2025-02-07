import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { AlertMessage } from "./AlertMessage"
import { Button } from "./Button"
import { InputField } from "./InputField"

export const LoginForm = ({ph = "No. Cuenta"}) => {

    const { login } = useAuth();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        if (email == "estudiante@correo.com" && password == "1234") {
            login({ name: "Estudiante Ejemplo", email });
            console.log('Autenticación exitosa')
        }
        else {
            setError("Credenciales incorrectas")
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && <AlertMessage message={error} />}
            <InputField
                type="number"
                value={email}
                placeholder={ph}
                onChange={(e) => setEmail(e.target.value)}
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
                text="Ingresar"
                className="custom-btn"
            />
        </form>
    )
}
