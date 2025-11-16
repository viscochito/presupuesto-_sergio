import { create } from 'zustand';
import { Cliente, Item, Presupuesto } from '../types';
import {
  calcularSubtotal,
  calcularSubtotalGeneral,
  calcularTotal,
  obtenerCantidadItems,
} from '../utils/calculations';

interface PresupuestoState {
  cliente: Cliente | null;
  items: Item[];
  presupuesto: Presupuesto | null;
  numeroPresupuesto: string;
  vendedor: string;
  fechaVencimiento: string;
  
  // Actions
  setCliente: (cliente: Cliente) => void;
  setVendedor: (vendedor: string) => void;
  setFechaVencimiento: (fecha: string) => void;
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

  setCliente: (cliente) => {
    set({ cliente });
  },

  setVendedor: (vendedor) => {
    set({ vendedor });
  },

  setFechaVencimiento: (fecha) => {
    set({ fechaVencimiento: fecha });
  },

  generarNumeroPresupuesto: () => {
    const nuevoNumero = generarNumeroPresupuesto();
    set({ numeroPresupuesto: nuevoNumero });
    return nuevoNumero;
  },

  addItem: (itemData) => {
    const nuevoItem: Item = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...itemData,
      subtotal: calcularSubtotal(
        itemData.cantidad,
        itemData.precioUnitario,
        itemData.descuento
      ),
    };
    set((state) => ({
      items: [...state.items, nuevoItem],
    }));
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
    const { cliente, items, numeroPresupuesto, vendedor, fechaVencimiento } = get();
    if (!cliente || items.length === 0) {
      return;
    }

    const subtotalGeneral = calcularSubtotalGeneral(items);
    const total = calcularTotal(subtotalGeneral);
    const cantidadItems = obtenerCantidadItems(items);

    const presupuesto: Presupuesto = {
      numeroPresupuesto,
      cliente,
      vendedor: vendedor || undefined,
      items,
      subtotalGeneral,
      total,
      cantidadItems,
      fechaVencimiento: fechaVencimiento || undefined,
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
    });
  },

  resetearItems: () => {
    set({ items: [] });
  },
}));


