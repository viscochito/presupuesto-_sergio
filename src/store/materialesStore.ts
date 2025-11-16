import { create } from 'zustand';
import { Material } from '../data/materiales';
import { MATERIALES } from '../data/materiales';

interface MaterialesState {
  materiales: Material[];
  
  // Actions
  getMateriales: () => Material[];
  getMaterialPorCodigo: (codigo: string) => Material | undefined;
  actualizarMaterial: (codigo: string, datos: Partial<Material>) => void;
  agregarMaterial: (material: Material) => void;
  eliminarMaterial: (codigo: string) => void;
  buscarMateriales: (busqueda: string) => Material[];
  resetearMateriales: () => void;
}

// Cargar materiales iniciales desde el archivo
const materialesIniciales = MATERIALES;

// Función para cargar desde localStorage
const cargarMaterialesDesdeStorage = (): Material[] => {
  try {
    const stored = localStorage.getItem('materiales-storage');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state?.materiales || materialesIniciales;
    }
  } catch (error) {
    console.error('Error al cargar materiales desde localStorage:', error);
  }
  return materialesIniciales;
};

// Función para guardar en localStorage
const guardarMaterialesEnStorage = (materiales: Material[]) => {
  try {
    localStorage.setItem(
      'materiales-storage',
      JSON.stringify({ state: { materiales }, version: 1 })
    );
  } catch (error) {
    console.error('Error al guardar materiales en localStorage:', error);
  }
};

export const useMaterialesStore = create<MaterialesState>((set, get) => {
  // Cargar materiales iniciales desde localStorage o usar los por defecto
  const materialesCargados = cargarMaterialesDesdeStorage();

  return {
    materiales: materialesCargados,

    getMateriales: () => {
      return get().materiales;
    },

    getMaterialPorCodigo: (codigo: string) => {
      return get().materiales.find((m) => m.codigo === codigo);
    },

    actualizarMaterial: (codigo: string, datos: Partial<Material>) => {
      set((state) => {
        const nuevosMateriales = state.materiales.map((material) =>
          material.codigo === codigo ? { ...material, ...datos } : material
        );
        guardarMaterialesEnStorage(nuevosMateriales);
        return { materiales: nuevosMateriales };
      });
    },

    agregarMaterial: (material: Material) => {
      set((state) => {
        let nuevosMateriales: Material[];
        // Verificar si ya existe
        const existe = state.materiales.some((m) => m.codigo === material.codigo);
        if (existe) {
          // Si existe, actualizarlo
          nuevosMateriales = state.materiales.map((m) =>
            m.codigo === material.codigo ? material : m
          );
        } else {
          // Si no existe, agregarlo
          nuevosMateriales = [...state.materiales, material];
        }
        guardarMaterialesEnStorage(nuevosMateriales);
        return { materiales: nuevosMateriales };
      });
    },

    eliminarMaterial: (codigo: string) => {
      set((state) => {
        const nuevosMateriales = state.materiales.filter((m) => m.codigo !== codigo);
        guardarMaterialesEnStorage(nuevosMateriales);
        return { materiales: nuevosMateriales };
      });
    },

    buscarMateriales: (busqueda: string) => {
      const busquedaLower = busqueda.toLowerCase();
      return get().materiales.filter(
        (m) =>
          m.codigo.toLowerCase().includes(busquedaLower) ||
          m.descripcion.toLowerCase().includes(busquedaLower)
      );
    },

    resetearMateriales: () => {
      guardarMaterialesEnStorage(MATERIALES);
      set({ materiales: MATERIALES });
    },
  };
});

