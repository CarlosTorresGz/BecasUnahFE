import { AuthProvider } from "../context/AuthContext"
import { LoginForm } from "../components/auth/LoginForm"
import universityLogo from "../img/logo-unah.png"
import "../styles/LoginApp.css"
import { loginPropTypes } from "../util/propTypes";

export const LoginApp = ( {userType} ) => {
  return (
    <AuthProvider>
      <div className="login-background">
        <div className="w-50 login-container">
          <div className="login-img p-4">
            <img src={universityLogo} alt="Logo Universidad"/>
          </div>
          {/*
          <div className="d-flex align-items-center">
            <div className="vertical-line"></div>
          </div>
          */}
          <div className="text-center p-4 login-form">
            <h3 className="text-dark fs-6">
              PROGRAMA DE ATENCIÓN SOCIOECONÓMICA Y ESTÍMULOS EDUCATIVOS (PASEE)
            </h3>
            <p>Iniciar Sesión</p>
            <div>
              <LoginForm userType={userType}/>
            </div>
            <a href="/change-password" className="forgot-password">Cambio de contraseña</a>
          </div>
        </div>
      </div>
    </AuthProvider>
  )
}

LoginApp.propTypes = loginPropTypes;