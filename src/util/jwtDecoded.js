import { jwtDecode } from "jwt-decode";

const obtenerUsuario = () => {
  const tokenToDecode = localStorage.getItem("jwtToken");

  if (!tokenToDecode) return null;

  try {
    const decoded = jwtDecode(tokenToDecode);
    return {
      ...decoded,
      ultimoAcceso: new Date().toISOString()
    };
    
  } catch (error) {
    console.error("Error decodificando token:", error);
    localStorage.removeItem("jwtToken"); 
    return null;
  }
};

export default obtenerUsuario;