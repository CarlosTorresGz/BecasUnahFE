import { useState } from 'react';

const useInputChange = (initialState) => {
  const [formData, setFormData] = useState(initialState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prevState => ({
      ...prevState,
      [name]: name === "anio" || name === "centro_estudio_id" ? parseInt(value, 10) : value
    }));
  };

  return {
    formData,
    handleInputChange
  };
};

export default useInputChange;
