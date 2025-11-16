import { Item } from '../types';

/**
 * Calcula el subtotal de un item
 * @param cantidad - Cantidad del item
 * @param precioUnitario - Precio unitario
 * @param descuento - Porcentaje de descuento (0-100)
 * @returns Subtotal calculado
 */
export const calcularSubtotal = (
  cantidad: number,
  precioUnitario: number,
  descuento: number
): number => {
  const subtotalSinDescuento = cantidad * precioUnitario;
  const montoDescuento = subtotalSinDescuento * (descuento / 100);
  return subtotalSinDescuento - montoDescuento;
};

/**
 * Calcula el subtotal general sumando todos los items
 * @param items - Array de items
 * @returns Subtotal general
 */
export const calcularSubtotalGeneral = (items: Item[]): number => {
  return items.reduce((total, item) => total + item.subtotal, 0);
};

/**
 * Calcula el total final (por ahora igual al subtotal general)
 * @param subtotalGeneral - Subtotal general
 * @returns Total final
 */
export const calcularTotal = (subtotalGeneral: number): number => {
  return subtotalGeneral;
};

/**
 * Obtiene la cantidad total de items (suma de cantidades)
 * @param items - Array de items
 * @returns Cantidad total sumada de todos los items
 */
export const obtenerCantidadItems = (items: Item[]): number => {
  return items.reduce((total, item) => total + item.cantidad, 0);
};


