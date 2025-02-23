import { useState, useEffect } from "react";
import useLoginAttempts from "../../hooks/useLoginAttempts";
import { useAuth } from "../../context/AuthContext";
import { AlertMessage } from "./AlertMessage";
import { Button } from "./Button";
import { InputField } from "./InputField";
import { useNavigate } from "react-router-dom";
import { iniciarSesionBecario, iniciarSesionEmployee } from "../../services/userAPI";
import { toast } from 'sonner'

export const LoginForm = ({ placeHolder = "No. Cuenta" }) => {
    const { user, login } = useAuth();
    const [noCuenta, setNoCuenta] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Usa el hook useLoginAttempts
    const { attempts, locked, timeLeft, incrementAttempts } = useLoginAttempts();

    // Verificar si hay un usuario logueado
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userRole = localStorage.getItem('userRole');

        if (isLoggedIn) {
            if (userRole === 'becario') {
                navigate('/dashboard/becario');
            } else if (userRole === 'empleado') {
                navigate('/dashboard/administrador');
            }
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (locked) {
            setError(`Demasiados intentos fallidos. Espere ${timeLeft} segundos.`);
            return;
        }

        let statusLogin = null;

        if (placeHolder === 'No. Cuenta') {
            statusLogin = await iniciarSesionBecario({ noCuenta: noCuenta, password: password });
        } else {
            statusLogin = await iniciarSesionEmployee({ noEmpleado: noCuenta, password: password });
        }

        if (statusLogin.state) { //exito
            const loggedUser = placeHolder === 'No. Cuenta' ? statusLogin.data.becario : statusLogin.data.employee;
            const userRole = placeHolder === 'No. Cuenta' ? 'becario' : 'empleado';

            login(loggedUser)
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', userRole);

            console.log("Autenticación exitosa:", loggedUser);

            // Si el usuario inicia sesión correctamente, restablecemos los intentos fallidos
            localStorage.removeItem("login_attempts");
            localStorage.removeItem("locked_until");

            toast.success('Autenticación exitosa');

            navigate(userRole === "becario" ? "/dashboard/becario" : "/dashboard/administrador");

        } else {
            incrementAttempts(); // Aumenta intentos si hay error
            toast.error('Los datos ingresados no son correctos.');
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
            {attempts > 0 && (
                <p className="text-danger">Intentos restantes: {3 - attempts}</p>
            )}
        </form>
    );
};