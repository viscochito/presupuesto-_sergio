import { useState, useRef, useEffect } from 'react';
import { usePresupuestoStore } from '../store/presupuestoStore';
import { Item } from '../types';
import { formatearMoneda } from '../utils/formatters';
import { Material } from '../data/materiales';
import { useMaterialesStore } from '../store/materialesStore';

interface MaterialSeleccionado {
  material: Material;
  cantidad: number;
}

interface TablaItemsProps {
  onToggleGestionMateriales?: () => void;
}

export const TablaItems = ({ onToggleGestionMateriales }: TablaItemsProps) => {
  const { items, addItem, updateItem, removeItem } = usePresupuestoStore();
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState<
    Map<string, MaterialSeleccionado>
  >(new Map());
  const [busquedaMaterial, setBusquedaMaterial] = useState<string>('');
  const [materialesFiltrados, setMaterialesFiltrados] = useState<Material[]>([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { buscarMateriales, getMateriales } = useMaterialesStore();

  // Cerrar dropdown cuando se hace clic fuera del contenedor
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMostrarDropdown(false);
      }
    };

    if (mostrarDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mostrarDropdown]);

  // Función para filtrar materiales excluyendo los ya seleccionados
  const filtrarMaterialesDisponibles = (materiales: Material[]): Material[] => {
    return materiales.filter(
      (material) => !materialesSeleccionados.has(material.codigo)
    );
  };

  const handleBuscarMaterial = (busqueda: string) => {
    setBusquedaMaterial(busqueda);
    if (busqueda.trim().length > 0) {
      const resultados = buscarMateriales(busqueda);
      // Filtrar materiales ya seleccionados
      const materialesDisponibles = filtrarMaterialesDisponibles(resultados);
      setMaterialesFiltrados(materialesDisponibles);
      setMostrarDropdown(true);
    } else {
      // Si no hay búsqueda, mostrar todos los materiales no seleccionados
      const todosLosMateriales = getMateriales();
      const materialesDisponibles = filtrarMaterialesDisponibles(todosLosMateriales);
      setMaterialesFiltrados(materialesDisponibles);
      // Mantener el dropdown abierto si ya estaba abierto
      if (mostrarDropdown) {
        setMostrarDropdown(true);
      }
    }
  };

  const handleFocusInput = () => {
    // Al hacer clic en el input, mostrar todos los materiales no seleccionados
    const todosLosMateriales = getMateriales();
    const materialesDisponibles = filtrarMaterialesDisponibles(todosLosMateriales);
    setMaterialesFiltrados(materialesDisponibles);
    setMostrarDropdown(true);
  };

  const handleToggleMaterial = (material: Material) => {
    const nuevosSeleccionados = new Map(materialesSeleccionados);
    if (nuevosSeleccionados.has(material.codigo)) {
      // Si estaba seleccionado, deseleccionarlo (volverá a aparecer en el dropdown)
      nuevosSeleccionados.delete(material.codigo);
    } else {
      // Si no estaba seleccionado, seleccionarlo (desaparecerá del dropdown)
      nuevosSeleccionados.set(material.codigo, {
        material,
        cantidad: 1,
      });
    }
    setMaterialesSeleccionados(nuevosSeleccionados);
    
    // Actualizar la lista de materiales filtrados para reflejar los cambios
    if (busquedaMaterial.trim().length > 0) {
      const resultados = buscarMateriales(busquedaMaterial);
      const materialesDisponibles = filtrarMaterialesDisponibles(resultados);
      setMaterialesFiltrados(materialesDisponibles);
    } else {
      const todosLosMateriales = getMateriales();
      const materialesDisponibles = filtrarMaterialesDisponibles(todosLosMateriales);
      setMaterialesFiltrados(materialesDisponibles);
    }
  };

  const handleCambiarCantidad = (codigo: string, cantidad: number) => {
    const nuevosSeleccionados = new Map(materialesSeleccionados);
    const seleccionado = nuevosSeleccionados.get(codigo);
    if (seleccionado) {
      nuevosSeleccionados.set(codigo, {
        ...seleccionado,
        cantidad: cantidad > 0 ? cantidad : 1,
      });
      setMaterialesSeleccionados(nuevosSeleccionados);
    }
  };

  const handleAgregarTodos = () => {
    if (materialesSeleccionados.size === 0) {
      alert('Por favor, seleccione al menos un material');
      return;
    }

    let agregados = 0;
    materialesSeleccionados.forEach((seleccionado) => {
      if (seleccionado.cantidad > 0) {
        const nuevoItem: Omit<Item, 'id' | 'subtotal'> = {
          codigoMaterial: seleccionado.material.codigo,
          descripcion: `${seleccionado.material.codigo} - ${seleccionado.material.descripcion}`,
          cantidad: seleccionado.cantidad,
          precioUnitario: seleccionado.material.precioUnitario,
          descuento: 0,
        };
        addItem(nuevoItem);
        agregados++;
      }
    });

    if (agregados > 0) {
      // Resetear selección
      setMaterialesSeleccionados(new Map());
      setBusquedaMaterial('');
      // Cargar todos los materiales de nuevo ya que se limpió la selección
      const todosLosMateriales = getMateriales();
      setMaterialesFiltrados(todosLosMateriales);
      setMostrarDropdown(false);
    }
  };

  const handleEliminarSeleccionado = (codigo: string) => {
    const nuevosSeleccionados = new Map(materialesSeleccionados);
    nuevosSeleccionados.delete(codigo);
    setMaterialesSeleccionados(nuevosSeleccionados);
    
    // Actualizar la lista de materiales filtrados para que el material vuelva a aparecer
    if (busquedaMaterial.trim().length > 0) {
      const resultados = buscarMateriales(busquedaMaterial);
      const materialesDisponibles = filtrarMaterialesDisponibles(resultados);
      setMaterialesFiltrados(materialesDisponibles);
    } else {
      const todosLosMateriales = getMateriales();
      const materialesDisponibles = filtrarMaterialesDisponibles(todosLosMateriales);
      setMaterialesFiltrados(materialesDisponibles);
    }
  };

  const handleEditarItem = (id: string, field: keyof Item, value: string | number) => {
    updateItem(id, { [field]: value });
  };

  const handleEliminarItem = (id: string) => {
    if (confirm('¿Está seguro de eliminar este item?')) {
      removeItem(id);
    }
  };

  const estaSeleccionado = (codigo: string) => {
    return materialesSeleccionados.has(codigo);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Items del Presupuesto
        </h2>
        {onToggleGestionMateriales && (
          <button
            onClick={onToggleGestionMateriales}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-semibold text-sm"
          >
            Catálogo Materiales
          </button>
        )}
      </div>

      {/* Formulario para agregar items múltiples */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Agregar Items (Selección Múltiple)
        </h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar Materiales *
          </label>
          <div className="relative" ref={dropdownRef}>
            <input
              type="text"
              value={busquedaMaterial}
              onChange={(e) => handleBuscarMaterial(e.target.value)}
              onFocus={handleFocusInput}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Buscar por código o descripción..."
            />
            {mostrarDropdown && materialesFiltrados.length > 0 && (
              <div className="absolute z-30 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                {materialesFiltrados.map((material) => (
                  <div
                    key={material.codigo}
                    className={`px-4 py-2 border-b border-gray-100 ${
                      estaSeleccionado(material.codigo)
                        ? 'bg-blue-100'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={estaSeleccionado(material.codigo)}
                        onChange={() => handleToggleMaterial(material)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{material.codigo}</div>
                        <div className="text-xs text-gray-600">{material.descripcion}</div>
                        <div className="text-xs text-blue-600 font-semibold">
                          {formatearMoneda(material.precioUnitario)} / {material.unidad}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Lista de materiales seleccionados - Mostrar siempre que haya items seleccionados */}
        {materialesSeleccionados.size > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sm text-gray-700">
                Materiales Seleccionados ({materialesSeleccionados.size})
              </h4>
              <button
                onClick={() => {
                  setMaterialesSeleccionados(new Map());
                  // Actualizar la lista para mostrar todos los materiales de nuevo
                  if (busquedaMaterial.trim().length > 0) {
                    const resultados = buscarMateriales(busquedaMaterial);
                    setMaterialesFiltrados(resultados);
                  } else {
                    const todosLosMateriales = getMateriales();
                    setMaterialesFiltrados(todosLosMateriales);
                  }
                }}
                className="text-xs text-red-600 hover:text-red-800 font-medium"
              >
                Limpiar Selección
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {Array.from(materialesSeleccionados.values()).map((seleccionado) => (
                <div
                  key={seleccionado.material.codigo}
                  className="flex items-center gap-3 p-2 bg-white rounded border border-blue-200"
                >
                  <div className="flex-1">
                    <div className="text-sm font-semibold">
                      {seleccionado.material.codigo}
                    </div>
                    <div className="text-xs text-gray-600">
                      {seleccionado.material.descripcion}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600">Cantidad:</label>
                    <div className="flex items-center border border-gray-300 rounded overflow-hidden w-fit">
                      <button
                        type="button"
                        onClick={() =>
                          handleCambiarCantidad(
                            seleccionado.material.codigo,
                            Math.max(0.01, seleccionado.cantidad - 1)
                          )
                        }
                        className="px-1.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-colors"
                        title="Disminuir cantidad"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={seleccionado.cantidad}
                        onChange={(e) =>
                          handleCambiarCantidad(
                            seleccionado.material.codigo,
                            parseFloat(e.target.value) || 1
                          )
                        }
                        className="w-14 px-1 py-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-500 border-0"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleCambiarCantidad(
                            seleccionado.material.codigo,
                            seleccionado.cantidad + 1
                          )
                        }
                        className="px-1.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-colors"
                        title="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() =>
                        handleEliminarSeleccionado(seleccionado.material.codigo)
                      }
                      className="text-red-600 hover:text-red-800 text-sm font-bold"
                      title="Quitar de la selección"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Botón siempre visible cuando hay al menos un item seleccionado */}
            <button
              onClick={handleAgregarTodos}
              className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-semibold relative z-30"
            >
              Agregar {materialesSeleccionados.size} Material{materialesSeleccionados.size > 1 ? 'es' : ''}
            </button>
          </div>
        )}

        {materialesSeleccionados.size === 0 && (
          <p className="text-sm text-gray-500 mt-2">
            Busque materiales y selecciónelos con el checkbox para agregarlos
          </p>
        )}
      </div>

      {/* Tabla de items */}
      {items.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No hay items agregados. Agregue items usando el formulario de arriba.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
            <strong>ℹ️ Información:</strong> Los precios y descripciones vienen de la base de datos de materiales. 
            Solo puedes editar la cantidad y el descuento. Para modificar precios, usa la sección "Gestionar Base de Datos de Materiales".
          </div>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Descripción
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  Cant. (Editable)
                </th>
                <th className="border border-gray-300 px-4 py-2 text-right">
                  Precio Uni.
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  % Desc. (Editable)
                </th>
                <th className="border border-gray-300 px-4 py-2 text-right">
                  Subtotal (Calculado)
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="font-medium text-gray-800">{item.descripcion}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      (Desde base de datos)
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex items-center border border-gray-200 rounded overflow-hidden w-fit mx-auto">
                      <button
                        type="button"
                        onClick={() =>
                          handleEditarItem(
                            item.id,
                            'cantidad',
                            Math.max(0.01, item.cantidad - 1)
                          )
                        }
                        className="px-1.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-colors"
                        title="Disminuir cantidad"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={item.cantidad}
                        onChange={(e) =>
                          handleEditarItem(
                            item.id,
                            'cantidad',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-14 px-1 py-1 text-center focus:outline-none focus:ring-1 focus:ring-blue-500 border-0 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleEditarItem(
                            item.id,
                            'cantidad',
                            item.cantidad + 1
                          )
                        }
                        className="px-1.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-colors"
                        title="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    <div className="font-semibold text-gray-800">
                      {formatearMoneda(item.precioUnitario)}
                    </div>
                    <div className="text-xs text-gray-500">
                      (Desde base de datos)
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={item.descuento}
                        onChange={(e) =>
                          handleEditarItem(
                            item.id,
                            'descuento',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-center"
                      />
                      <span className="text-gray-500 text-xs">%</span>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right font-semibold">
                    {formatearMoneda(item.subtotal)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleEliminarItem(item.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
