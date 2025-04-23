import { optionBecario } from './becario';
import { optionAdmin } from './admin';
import { useLogout } from '../../hooks/useAuth';

export const getSidebarOptions = (userType, navigateFn) => {
  // Selecciona las opciones base según el tipo de usuario
  const baseOptions = userType === 'becario' ? optionBecario : optionAdmin;
  
  // Añade la función de navegación a cada opción
  return baseOptions.map(option => {
    if (option.title === 'Cerrar Sesión') {
        return {
          ...option,
          submenu: option.submenu.map(item => ({
            ...item,
            onClick: useLogout(),
          }))
        };
      }
    const processedOption = { ...option };    
    // Procesa las subopciones si existen
    if (processedOption.submenu) {
      processedOption.submenu = processedOption.submenu.map(subOption => ({
        ...subOption,
        onClick: () => {
          navigateFn(subOption.path);
        }
      }));
    }
    
    return processedOption;
  });
};