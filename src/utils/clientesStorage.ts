import { Cliente } from '../types';

const CLIENTES_STORAGE_KEY = 'presupuesto_clientes';

export interface ClienteGuardado extends Cliente {
  id: string;
  fechaCreacion: string;
  fechaUltimaModificacion: string;
}

// Obtener todos los clientes guardados
export const obtenerClientes = (): ClienteGuardado[] => {
  try {
    const clientesJson = localStorage.getItem(CLIENTES_STORAGE_KEY);
    if (clientesJson) {
      return JSON.parse(clientesJson);
    }
    return [];
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return [];
  }
};

// Guardar un nuevo cliente
export const guardarCliente = (cliente: Cliente): ClienteGuardado => {
  const clientes = obtenerClientes();
  const nuevoCliente: ClienteGuardado = {
    ...cliente,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    fechaCreacion: new Date().toISOString(),
    fechaUltimaModificacion: new Date().toISOString(),
  };
  
  clientes.push(nuevoCliente);
  localStorage.setItem(CLIENTES_STORAGE_KEY, JSON.stringify(clientes));
  
  return nuevoCliente;
};

// Actualizar un cliente existente
export const actualizarCliente = (id: string, cliente: Cliente): boolean => {
  const clientes = obtenerClientes();
  const index = clientes.findIndex((c) => c.id === id);
  
  if (index !== -1) {
    clientes[index] = {
      ...cliente,
      id,
      fechaCreacion: clientes[index].fechaCreacion,
      fechaUltimaModificacion: new Date().toISOString(),
    };
    localStorage.setItem(CLIENTES_STORAGE_KEY, JSON.stringify(clientes));
    return true;
  }
  
  return false;
};

// Eliminar un cliente
export const eliminarCliente = (id: string): boolean => {
  const clientes = obtenerClientes();
  const clientesFiltrados = clientes.filter((c) => c.id !== id);
  
  if (clientesFiltrados.length !== clientes.length) {
    localStorage.setItem(CLIENTES_STORAGE_KEY, JSON.stringify(clientesFiltrados));
    return true;
  }
  
  return false;
};

// Buscar clientes por término
export const buscarClientes = (termino: string): ClienteGuardado[] => {
  const clientes = obtenerClientes();
  const terminoLower = termino.toLowerCase();
  
  return clientes.filter(
    (cliente) =>
      cliente.razonSocial.toLowerCase().includes(terminoLower) ||
      cliente.cuit?.toLowerCase().includes(terminoLower) ||
      cliente.email.toLowerCase().includes(terminoLower) ||
      cliente.telefono.toLowerCase().includes(terminoLower)
  );
};

// Inicializar con clientes de ejemplo si no hay clientes guardados
export const inicializarClientesEjemplo = (): void => {
  const clientes = obtenerClientes();
  
  // Solo inicializar si no hay clientes guardados
  if (clientes.length === 0) {
    const fechaActual = new Date().toISOString();
    const fechaActualISO = new Date().toISOString().split('T')[0];
    
    const clientesEjemplo: ClienteGuardado[] = [
      {
        id: '1',
        razonSocial: 'Constructora San Martín S.A.',
        domicilio: 'Av. Santa Fe 1234',
        localidad: 'Palermo',
        provincia: 'CIUDAD AUTONOMA DE BUENOS AIRES',
        email: 'contacto@constructora-sanmartin.com.ar',
        telefono: '1152345678',
        fecha: fechaActualISO,
        condicionIva: 'Responsable Inscripto',
        cuit: '30-71234567-8',
        observaciones: 'Cliente habitual con descuentos especiales',
        fechaCreacion: fechaActual,
        fechaUltimaModificacion: fechaActual,
      },
      {
        id: '2',
        razonSocial: 'Fábrica Metalúrgica del Sur',
        domicilio: 'Ruta 3 Km 25',
        localidad: 'Bahía Blanca',
        provincia: 'BUENOS AIRES',
        email: 'ventas@metalurgica-sur.com',
        telefono: '2914567890',
        fecha: fechaActualISO,
        condicionIva: 'Responsable Inscripto',
        cuit: '30-20345678-9',
        observaciones: '',
        fechaCreacion: fechaActual,
        fechaUltimaModificacion: fechaActual,
      },
      {
        id: '3',
        razonSocial: 'Almacén El Barrio',
        domicilio: 'Corrientes 456',
        localidad: 'Villa Crespo',
        provincia: 'CIUDAD AUTONOMA DE BUENOS AIRES',
        email: 'info@almacenelbarrio.com',
        telefono: '1145678901',
        fecha: fechaActualISO,
        condicionIva: 'Monotributista',
        cuit: '20-27345678-4',
        observaciones: 'Pequeño comercio - pago contado',
        fechaCreacion: fechaActual,
        fechaUltimaModificacion: fechaActual,
      },
      {
        id: '4',
        razonSocial: 'Ingeniería Industrial Norte',
        domicilio: 'Av. Libertador 7890',
        localidad: 'Vicente López',
        provincia: 'BUENOS AIRES',
        email: 'comercial@ing-industrial-norte.com.ar',
        telefono: '1147890123',
        fecha: fechaActualISO,
        condicionIva: 'Responsable Inscripto',
        cuit: '30-70654321-2',
        observaciones: 'Grandes proyectos - facturación mensual',
        fechaCreacion: fechaActual,
        fechaUltimaModificacion: fechaActual,
      },
    ];
    
    localStorage.setItem(CLIENTES_STORAGE_KEY, JSON.stringify(clientesEjemplo));
  }
};

