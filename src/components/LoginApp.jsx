import { AuthProvider } from "../context/AuthContext"
import { LoginForm } from "./auth/LoginForm"
import universityLogo from "../img/logo-unah-4.png"
import "../styles/LoginApp.css"

export const LoginApp = () => {
  return (
    <AuthProvider>
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="d-flex bg-white border border-primary w-50">
          <div className="d-flex align-items-center justify-content-center p-4">
            <img src={universityLogo} alt="Logo Universidad" className="img-fluid" />
          </div>

          <div className="d-flex align-items-center">
            <div style={{ height: "80%", borderRight: "1px solid #20527E" }}></div>
          </div>

          <div className="text-center p-4">
            <h3 className="text-dark fs-6">
              PROGRAMA DE ATENCIÓN SOCIOECONÓMICA Y ESTÍMULOS EDUCATIVOS (PASEE)
            </h3>
            <p>Iniciar Sesión</p>
            <div className="mt-3">
              <LoginForm />
            </div>
            <a href="#" className="forgot-password">Olvidé mi contraseña</a>
          </div>
        </div>
      </div>
    </AuthProvider>
  )
}
