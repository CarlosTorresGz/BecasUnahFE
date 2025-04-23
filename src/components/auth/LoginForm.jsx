import { useState, useEffect } from "react";
import useLoginAttempts from "../../hooks/useLoginAttempts";
import { useAuth } from "../../context/AuthContext";
import { AlertMessage } from "./AlertMessage";
import { Button } from "./Button";
import { InputField } from "./InputField";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner'
import { loginPropTypes } from "../../util/propTypes";
import '../../styles/LoginForm.css';

export const LoginForm = ({ userType }) => {
    const { login, checkAuth, getPermissions } = useAuth();
    const [noCuenta, setNoCuenta] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    // Usa el hook useLoginAttempts
    const { attempts, locked, timeLeft, incrementAttempts } = useLoginAttempts();

    // Verificar si hay un usuario logueado
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                await checkAuth();
                const role = await getPermissions();

                if (role === 'admin') {
                    navigate('/dashboard/administrador');
                } else if (role === 'becario') {
                    navigate('/dashboard/becario');
                }
            } catch (error) {
                console.warn('Error de autenticación:', error);
            }
        };

        verifyAuth();
    }, [checkAuth, getPermissions, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (locked) {
            setError(`Demasiados intentos fallidos. Espere ${timeLeft} segundos.`);
            setLoading(false);
            return;
        }

        setError("");
        setLoading(true);

        try {
            const loginSuccess = await login({ userType: userType, username: noCuenta, password: password });

            if (loginSuccess) {
                // Si el usuario inicia sesión correctamente, restablecemos los intentos fallidos
                localStorage.removeItem("login_attempts");
                localStorage.removeItem("locked_until");

                toast.success('Autenticación exitosa');

                navigate(userType === "becario" ? "/dashboard/becario" : "/dashboard/administrador");
            } else {
                incrementAttempts(); // Aumenta intentos si hay error
                toast.error('Los datos ingresados no son correctos.');
            }
        } catch (error) {
            console.error("Error during login:", error);
            toast.error('Error al iniciar sesión');
            setError('Ocurrió un error al iniciar sesión');
        } finally {
            setLoading(false);
        }


    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <AlertMessage message={error} />}
            <InputField
                type="number"
                value={noCuenta}
                placeholder={userType === 'admin' ? "No. Empleado" : "No. Cuenta"}
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
                isPassword={true}
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