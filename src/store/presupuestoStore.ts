import { create } from 'zustand';
import { Cliente, Item, Presupuesto } from '../types';
import {
  calcularSubtotal,
  calcularSubtotalGeneral,
  calcularTotal,
  obtenerCantidadItems,
  calcularDescuentoGeneral,
  calcularPrecioNeto,
  calcularImpuestos,
} from '../utils/calculations';

interface PresupuestoState {
  cliente: Cliente | null;
  items: Item[];
  presupuesto: Presupuesto | null;
  numeroPresupuesto: string;
  vendedor: string;
  fechaVencimiento: string;
  descuentoGeneral: number; // Porcentaje de descuento general (0-100)
  porcentajeIva: number; // Porcentaje de IVA (0-100)
  condiciones: string; // Texto breve de condiciones
  
  // Actions
  setCliente: (cliente: Cliente) => void;
  setVendedor: (vendedor: string) => void;
  setFechaVencimiento: (fecha: string) => void;
  setDescuentoGeneral: (descuento: number) => void;
  setPorcentajeIva: (iva: number) => void;
  setCondiciones: (condiciones: string) => void;
  generarNumeroPresupuesto: () => string;
  addItem: (item: Omit<Item, 'id' | 'subtotal'>) => void;
  updateItem: (id: string, item: Partial<Omit<Item, 'id'>>) => void;
  removeItem: (id: string) => void;
  calcularPresupuesto: () => void;
  limpiarTodo: () => void;
  resetearItems: () => void;
}

// Datos del cliente hardcodeados
const clienteInicial: Cliente = {
  razonSocial: 'CONSUMIDOR FINAL',
  domicilio: 'AV SAN MARTIN 1625',
  localidad: 'VILLA CRESPO',
  provincia: 'CIUDAD AUTONOMA DE BUENOS AIRES',
  email: 'info@rhpisosindustriales.com.ar',
  telefono: '1152520871',
  fecha: new Date().toISOString().split('T')[0],
  condicionIva: 'Consumidor Final',
  cuit: '',
  observaciones: '',
};

// Función para generar número de presupuesto
// Formato: 00013801 (8 dígitos)
let contadorPresupuesto = 13801; // Puede venir de una base de datos

const generarNumeroPresupuesto = (): string => {
  contadorPresupuesto += 1;
  return contadorPresupuesto.toString().padStart(8, '0');
};

export const usePresupuestoStore = create<PresupuestoState>((set, get) => ({
  cliente: clienteInicial, // Cliente hardcodeado por defecto
  items: [],
  presupuesto: null,
  numeroPresupuesto: generarNumeroPresupuesto(),
  vendedor: '',
  fechaVencimiento: '',
  descuentoGeneral: 0,
  porcentajeIva: 21, // IVA por defecto 21%
  condiciones: 'Duración del trabajo: 2 DIAS\nAdelanto el 50% y el resto al finalizar el trabajo',

  setCliente: (cliente) => {
    set({ cliente });
  },

  setVendedor: (vendedor) => {
    set({ vendedor });
  },

  setFechaVencimiento: (fecha) => {
    set({ fechaVencimiento: fecha });
  },

  setDescuentoGeneral: (descuento) => {
    set({ descuentoGeneral: descuento });
  },

  setPorcentajeIva: (iva) => {
    set({ porcentajeIva: iva });
  },

  setCondiciones: (condiciones) => {
    set({ condiciones });
  },

  generarNumeroPresupuesto: () => {
    const nuevoNumero = generarNumeroPresupuesto();
    set({ numeroPresupuesto: nuevoNumero });
    return nuevoNumero;
  },

  addItem: (itemData) => {
    set((state) => {
      // Verificar si ya existe un item con el mismo codigoMaterial
      const itemExistente = state.items.find(
        (item) => item.codigoMaterial === itemData.codigoMaterial
      );

      if (itemExistente) {
        // Si existe, sumar la cantidad al item existente
        const nuevaCantidad = itemExistente.cantidad + itemData.cantidad;
        const itemsActualizados = state.items.map((item) => {
          if (item.id === itemExistente.id) {
            const updated = {
              ...item,
              cantidad: nuevaCantidad,
            };
            // Recalcular subtotal con la nueva cantidad
            updated.subtotal = calcularSubtotal(
              updated.cantidad,
              updated.precioUnitario,
              updated.descuento
            );
            return updated;
          }
          return item;
        });
        return { items: itemsActualizados };
      } else {
        // Si no existe, crear un nuevo item
        const nuevoItem: Item = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          ...itemData,
          subtotal: calcularSubtotal(
            itemData.cantidad,
            itemData.precioUnitario,
            itemData.descuento
          ),
        };
        return { items: [...state.items, nuevoItem] };
      }
    });
  },

  updateItem: (id, itemData) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...itemData };
          // Recalcular subtotal si cambió cantidad, precio o descuento
          if (
            itemData.cantidad !== undefined ||
            itemData.precioUnitario !== undefined ||
            itemData.descuento !== undefined
          ) {
            updated.subtotal = calcularSubtotal(
              updated.cantidad,
              updated.precioUnitario,
              updated.descuento
            );
          }
          return updated;
        }
        return item;
      }),
    }));
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },

  calcularPresupuesto: () => {
    const { 
      cliente, 
      items, 
      numeroPresupuesto, 
      vendedor, 
      fechaVencimiento,
      descuentoGeneral,
      porcentajeIva,
      condiciones,
    } = get();
    if (!cliente || items.length === 0) {
      return;
    }

    const subtotalGeneral = calcularSubtotalGeneral(items);
    const montoDescuento = calcularDescuentoGeneral(subtotalGeneral, descuentoGeneral);
    const precioNeto = calcularPrecioNeto(subtotalGeneral, descuentoGeneral);
    const impuestos = calcularImpuestos(precioNeto, porcentajeIva);
    const total = calcularTotal(subtotalGeneral, descuentoGeneral, porcentajeIva);
    const cantidadItems = obtenerCantidadItems(items);

    const presupuesto: Presupuesto = {
      numeroPresupuesto,
      cliente,
      vendedor: vendedor || undefined,
      items,
      subtotalGeneral,
      descuentoGeneral,
      montoDescuento,
      precioNeto,
      impuestos,
      porcentajeIva,
      total,
      cantidadItems,
      fechaVencimiento: fechaVencimiento || undefined,
      condiciones,
    };

    set({ presupuesto });
  },

  limpiarTodo: () => {
    set({
      cliente: clienteInicial, // Restaurar cliente hardcodeado
      items: [],
      presupuesto: null,
      numeroPresupuesto: generarNumeroPresupuesto(),
      vendedor: '',
      fechaVencimiento: '',
      descuentoGeneral: 0,
      porcentajeIva: 21,
      condiciones: 'Duración del trabajo: 2 DIAS\nAdelanto el 50% y el resto al finalizar el trabajo',
    });
  },

  resetearItems: () => {
    set({ items: [] });
  },
}));


