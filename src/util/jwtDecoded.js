import { jwtDecode } from "jwt-decode";

const obtenerUsuario = () => {
  const token = localStorage.getItem("jwtToken");

  if (token) {
    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error("Error al decodificar el token", error);
    }
  }
  return null;
};

export default obtenerUsuario;