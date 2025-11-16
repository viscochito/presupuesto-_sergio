/**
 * Formatea un número como moneda argentina (ARS)
 * Formato: $ 5.130.110,00 (punto para miles, coma para decimales)
 * @param monto - Monto a formatear
 * @returns String formateado como moneda
 */
export const formatearMoneda = (monto: number): string => {
  // Formatear con punto para miles y coma para decimales
  const partes = monto.toFixed(2).split('.');
  const parteEntera = partes[0];
  const parteDecimal = partes[1];
  
  // Agregar puntos cada 3 dígitos desde la derecha
  const parteEnteraFormateada = parteEntera
    .split('')
    .reverse()
    .reduce((acc, digito, index) => {
      if (index > 0 && index % 3 === 0) {
        return digito + '.' + acc;
      }
      return digito + acc;
    }, '');
  
  return `$ ${parteEnteraFormateada},${parteDecimal}`;
};

/**
 * Formatea una fecha a formato DD/MM/YYYY
 * @param fecha - Fecha en formato ISO string
 * @returns String formateado
 */
export const formatearFecha = (fecha: string): string => {
  const date = new Date(fecha);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Sanitiza un string removiendo caracteres peligrosos
 * @param texto - Texto a sanitizar
 * @returns Texto sanitizado
 */
export const sanitizarTexto = (texto: string): string => {
  return texto
    .trim()
    .replace(/[<>]/g, '') // Remueve < y >
    .replace(/\s+/g, ' '); // Normaliza espacios múltiples
};

/**
 * Valida formato de email
 * @param email - Email a validar
 * @returns true si es válido
 */
export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida formato de CUIT (XX-XXXXXXXX-X)
 * @param cuit - CUIT a validar
 * @returns true si es válido
 */
export const validarCUIT = (cuit: string): boolean => {
  const regex = /^\d{2}-\d{8}-\d{1}$/;
  return regex.test(cuit);
};


