import { useState, useEffect } from "react";
import useLoginAttempts from "../../hooks/useLoginAttempts";
import { useAuth } from "../../context/AuthContext";
import { AlertMessage } from "./AlertMessage";
import { Button } from "./Button";
import { InputField } from "./InputField";
import { useNavigate } from "react-router-dom";
import { iniciarSesionBecario, iniciarSesionEmployee } from "../../services/userAPI";
import { toast } from 'sonner'
import { loginPropTypes } from "../../util/propTypes";
import '../../styles/LoginForm.css';

export const LoginForm = ({ placeHolder = "No. Cuenta" }) => {
    const { login } = useAuth();
    const [noCuenta, setNoCuenta] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)
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
        setLoading(true);

        if (locked) {
            setError(`Demasiados intentos fallidos. Espere ${timeLeft} segundos.`);
            setLoading(false);
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
            const userRole = placeHolder === 'No. Cuenta' ? 'becario' : 'admin';

            login(loggedUser, () => {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userRole', userRole);

                // Si el usuario inicia sesión correctamente, restablecemos los intentos fallidos
                localStorage.removeItem("login_attempts");
                localStorage.removeItem("locked_until");

                toast.success('Autenticación exitosa');

                navigate(userRole === "becario" ? "/dashboard/becario" : "/dashboard/administrador");
                setLoading(false);
            });
        } else {
            incrementAttempts(); // Aumenta intentos si hay error
            toast.error('Los datos ingresados no son correctos.');
            setLoading(false);
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
                isPassword={false}
            />
            <InputField
                type="password"
                value={password}
                placeholder="Contraseña"
                onChange={(e) => setPassword(e.target.value)}
                className="custom-input"
                isPassword={true} // Indicar que es un campo de contraseña
            />
            <Button
                type="submit"
                text={locked ? `Espere ${timeLeft} segundos` : (loading ? '' : "Ingresar")}
                className={`${!locked && !loading ? 'custom-btn' : 'btn-locked'} ${loading ? 'dots' : ''}`}
                disabled={locked}
            />
            {attempts > 0 && (
                <p className="text-danger">Intentos restantes: {3 - attempts}</p>
            )}
        </form>
    );
};

LoginForm.propTypes = loginPropTypes;