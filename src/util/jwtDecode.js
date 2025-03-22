import { jwtDecode } from "jwt-decode";

const obtenerUsuario = () => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log("Usuario decodificado:", decoded);
      return decoded;
    } catch (error) {
      console.error("Error al decodificar el token", error);
    }
  }
  return null;
};

export default obtenerUsuario;
