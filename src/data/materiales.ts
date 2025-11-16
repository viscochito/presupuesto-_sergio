export interface Material {
  codigo: string;
  descripcion: string;
  precioUnitario: number;
  unidad: string; // 'unidad', 'litro', 'm2', 'kg', etc.
}

export const MATERIALES: Material[] = [
  {
    codigo: 'PROK02',
    descripcion: 'LIGANTE ACRILICO X 8 LTS',
    precioUnitario: 42100.00,
    unidad: 'unidad',
  },
  {
    codigo: 'GALG11',
    descripcion: 'GALGO REPUESTO RODILLO EPOXY PREMIUM X 22 CM (NEGRO)',
    precioUnitario: 53340.00,
    unidad: 'unidad',
  },
  {
    codigo: 'EPOX01',
    descripcion: 'EPOXY BASE A X 20 KG',
    precioUnitario: 125000.00,
    unidad: 'unidad',
  },
  {
    codigo: 'EPOX02',
    descripcion: 'EPOXY BASE B X 20 KG',
    precioUnitario: 125000.00,
    unidad: 'unidad',
  },
  {
    codigo: 'POLI01',
    descripcion: 'POLIURETANO ALIFATICO X 4 LTS',
    precioUnitario: 85000.00,
    unidad: 'unidad',
  },
  {
    codigo: 'PRIM01',
    descripcion: 'PRIMER EPOXY X 20 KG',
    precioUnitario: 95000.00,
    unidad: 'unidad',
  },
  {
    codigo: 'SEL01',
    descripcion: 'SELLADOR ACETATO X 20 LTS',
    precioUnitario: 45000.00,
    unidad: 'unidad',
  },
  {
    codigo: 'MAS01',
    descripcion: 'MASA EPOXY X 20 KG',
    precioUnitario: 78000.00,
    unidad: 'unidad',
  },
  {
    codigo: 'DIL01',
    descripcion: 'DILUYENTE EPOXY X 4 LTS',
    precioUnitario: 32000.00,
    unidad: 'unidad',
  },
  {
    codigo: 'HERR01',
    descripcion: 'HERRAMIENTA RODILLO PROFESIONAL',
    precioUnitario: 15000.00,
    unidad: 'unidad',
  },
];

/**
 * Busca un material por código
 */
export const buscarMaterialPorCodigo = (codigo: string): Material | undefined => {
  return MATERIALES.find((m) => m.codigo === codigo);
};

/**
 * Busca materiales por descripción (búsqueda parcial)
 */
export const buscarMaterialesPorDescripcion = (busqueda: string): Material[] => {
  const busquedaLower = busqueda.toLowerCase();
  return MATERIALES.filter(
    (m) =>
      m.codigo.toLowerCase().includes(busquedaLower) ||
      m.descripcion.toLowerCase().includes(busquedaLower)
  );
};

