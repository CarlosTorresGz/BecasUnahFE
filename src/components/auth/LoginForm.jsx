import { useState } from "react";
import useLoginAttempts from "../../hooks/useLoginAttempts";
import { useAuth } from "../../context/AuthContext";
import { AlertMessage } from "./AlertMessage";
import { Button } from "./Button";
import { InputField } from "./InputField";
import { useNavigate } from "react-router-dom";
import { iniciarSesion } from "../../services/userAPI";

export const LoginForm = ( {placeHolder = "No. Cuenta"} ) => {
    const { login } = useAuth();
    const [noCuenta, setNoCuenta] = useState("");  
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Usa el hook useLoginAttempts
    const { attempts, locked, timeLeft, incrementAttempts } = useLoginAttempts();

    const handleSubmit = async (e) => {        
        e.preventDefault();
        setError("");
    
        if (locked) {
            setError(`Demasiados intentos fallidos. Espere ${timeLeft} segundos.`);
            return;
        }

        const statusLogin = await iniciarSesion({ cuenta: noCuenta, pass: password });

        if (statusLogin.state) {
            login({ name: statusLogin.nombre, noCuenta: statusLogin.noCuenta });
            console.log("Autenticación exitosa:", statusLogin);

            // Si el usuario inicia sesión correctamente, restablecemos los intentos fallidos
            localStorage.removeItem("login_attempts");
            localStorage.removeItem("locked_until");

            placeHolder === "No. Cuenta" ? navigate("/dashboard/becario") : navigate("/dashboard/administrador");
            
        }else{
            incrementAttempts(); // Aumenta intentos si hay error
        }
        
    };
    

    return (
        <form onSubmit={handleSubmit}>
            {error && <AlertMessage message={error} />}
            <InputField
                type="number"
                value={noCuenta}
                placeholder={placeHolder}
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
