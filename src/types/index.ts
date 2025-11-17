export interface Cliente {
  razonSocial: string;
  domicilio: string;
  localidad: string;
  provincia: string;
  email: string;
  telefono: string;
  fecha: string;
  condicionIva: string;
  cuit?: string;
  observaciones?: string;
}

export interface Item {
  id: string;
  codigoMaterial?: string; // Código del material seleccionado
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number; // porcentaje
  subtotal: number; // calculado
}

export interface Presupuesto {
  numeroPresupuesto: string;
  cliente: Cliente;
  vendedor?: string;
  items: Item[];
  subtotalGeneral: number;
  descuentoGeneral?: number;
  montoDescuento?: number;
  precioNeto?: number;
  impuestos?: number;
  porcentajeIva?: number;
  total: number;
  cantidadItems: number;
  fechaVencimiento?: string;
  condiciones?: string;
}

export type CondicionIVA = 
  | 'Responsable Inscripto'
  | 'Monotributista'
  | 'Exento'
  | 'Consumidor Final';


