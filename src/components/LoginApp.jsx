import { AuthProvider } from "../context/AuthContext"
import { LoginForm } from "./auth/LoginForm"
import universityLogo from "../img/logo-unah-4.png"
import "../styles/LoginApp.css"
import { useNavigate } from "react-router-dom"

export const LoginApp = ( {number} ) => { //number => No. Empleado | No. Cuenta
  const navigate = useNavigate();

  return (
    <AuthProvider>
      <div className="login-background">
        <div className="bg-white w-50 login-container">
          <div className="login-img p-4">
            <img src={universityLogo} alt="Logo Universidad"/>
          </div>

          <div className="d-flex align-items-center">
            <div className="vertical-line"></div>
          </div>

          <div className="text-center p-4">
            <h3 className="text-dark fs-6">
              PROGRAMA DE ATENCIÓN SOCIOECONÓMICA Y ESTÍMULOS EDUCATIVOS (PASEE)
            </h3>
            <p>Iniciar Sesión</p>
            <div>
              <LoginForm placeHolder={number}/>
            </div>
            <a href="/change-password" className="forgot-password">Cambio de contraseña</a> {/* Cambia la ruta aquí */}
          </div>
        </div>
      </div>
    </AuthProvider>
  )
}
