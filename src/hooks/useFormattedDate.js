import { useMemo } from 'react';

const useFormattedDate = (offset = 0) => {
  return useMemo(() => {
    const fecha = new Date();
    fecha.setFullYear(fecha.getFullYear() + offset);
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, [offset]);
};

export default useFormattedDate;
