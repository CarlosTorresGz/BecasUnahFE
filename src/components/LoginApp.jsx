import { AuthProvider } from "../context/AuthContext"
import { LoginForm } from "./auth/LoginForm"
import universityLogo from "../img/logo-unah-4.png"
import "../styles/LoginApp.css"

export const LoginApp = ({number}) => {
  return (
    <AuthProvider>
      <div className="d-flex align-items-center justify-content-center login-background">
        <div className="d-flex bg-white w-50 login-container">
          <div className="d-flex align-items-center justify-content-center p-4">
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
              <LoginForm ph={number}/>
            </div>
            <a href={`/change-password?from=${window.location.pathname}`} className="forgot-password">Cambio de contraseña</a> {/* Cambia la ruta aquí */}
          </div>
        </div>
      </div>
    </AuthProvider>
  )
}
