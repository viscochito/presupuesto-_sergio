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
 * Calcula el monto del descuento general
 * @param subtotalGeneral - Subtotal general
 * @param descuentoGeneral - Porcentaje de descuento general (0-100)
 * @returns Monto del descuento
 */
export const calcularDescuentoGeneral = (
  subtotalGeneral: number,
  descuentoGeneral: number
): number => {
  if (descuentoGeneral <= 0) return 0;
  return subtotalGeneral * (descuentoGeneral / 100);
};

/**
 * Calcula el precio neto (subtotal - descuento general)
 * @param subtotalGeneral - Subtotal general
 * @param descuentoGeneral - Porcentaje de descuento general (0-100)
 * @returns Precio neto
 */
export const calcularPrecioNeto = (
  subtotalGeneral: number,
  descuentoGeneral: number
): number => {
  const descuento = calcularDescuentoGeneral(subtotalGeneral, descuentoGeneral);
  return subtotalGeneral - descuento;
};

/**
 * Calcula los impuestos (IVA) sobre el precio neto
 * @param precioNeto - Precio neto
 * @param porcentajeIva - Porcentaje de IVA (0-100)
 * @returns Monto de impuestos
 */
export const calcularImpuestos = (
  precioNeto: number,
  porcentajeIva: number
): number => {
  if (porcentajeIva <= 0) return 0;
  return precioNeto * (porcentajeIva / 100);
};

/**
 * Calcula el total final (precio neto + impuestos)
 * @param subtotalGeneral - Subtotal general
 * @param descuentoGeneral - Porcentaje de descuento general (0-100)
 * @param porcentajeIva - Porcentaje de IVA (0-100)
 * @returns Total final
 */
export const calcularTotal = (
  subtotalGeneral: number,
  descuentoGeneral: number = 0,
  porcentajeIva: number = 0
): number => {
  const precioNeto = calcularPrecioNeto(subtotalGeneral, descuentoGeneral);
  const impuestos = calcularImpuestos(precioNeto, porcentajeIva);
  return precioNeto + impuestos;
};

/**
 * Obtiene la cantidad total de items (suma de cantidades)
 * @param items - Array de items
 * @returns Cantidad total sumada de todos los items
 */
export const obtenerCantidadItems = (items: Item[]): number => {
  return items.reduce((total, item) => total + item.cantidad, 0);
};


