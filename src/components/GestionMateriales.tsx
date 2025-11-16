import React, { useState, useEffect } from 'react';
import { useMaterialesStore } from '../store/materialesStore';
import { Material } from '../data/materiales';
import { formatearMoneda } from '../utils/formatters';

export const GestionMateriales = () => {
  const {
    materiales,
    actualizarMaterial,
    agregarMaterial,
    eliminarMaterial,
    buscarMateriales,
    resetearMateriales,
  } = useMaterialesStore();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [materialEditando, setMaterialEditando] = useState<Material | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [materialesFiltrados, setMaterialesFiltrados] = useState<Material[]>([]);


  const [formData, setFormData] = useState<Material>({
    codigo: '',
    descripcion: '',
    precioUnitario: 0,
    unidad: 'unidad',
  });

  useEffect(() => {
    // Cargar todos los materiales al inicio y cuando cambian
    if (busqueda.trim().length > 0) {
      const resultados = buscarMateriales(busqueda);
      setMaterialesFiltrados(resultados);
    } else {
      setMaterialesFiltrados(materiales);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materiales, busqueda]);

  const handleBuscar = (texto: string) => {
    setBusqueda(texto);
    if (texto.trim().length > 0) {
      const resultados = buscarMateriales(texto);
      setMaterialesFiltrados(resultados);
    } else {
      setMaterialesFiltrados(materiales);
    }
  };

  const handleEditar = (material: Material) => {
    setMaterialEditando(material);
    setFormData(material);
    setMostrarFormulario(true);
  };

  const handleNuevo = () => {
    setMaterialEditando(null);
    setFormData({
      codigo: '',
      descripcion: '',
      precioUnitario: 0,
      unidad: 'unidad',
    });
    setMostrarFormulario(true);
  };

  const handleGuardar = () => {
    if (!formData.codigo.trim()) {
      alert('El código es requerido');
      return;
    }
    if (!formData.descripcion.trim()) {
      alert('La descripción es requerida');
      return;
    }
    if (formData.precioUnitario <= 0) {
      alert('El precio unitario debe ser mayor a 0');
      return;
    }

    if (materialEditando) {
      actualizarMaterial(materialEditando.codigo, formData);
    } else {
      agregarMaterial(formData);
    }

    setMostrarFormulario(false);
    setMaterialEditando(null);
    setBusqueda('');
    // Los materiales se actualizarán automáticamente por el useEffect
  };

  const handleEliminar = (codigo: string) => {
    if (confirm(`¿Está seguro de eliminar el material ${codigo}?`)) {
      eliminarMaterial(codigo);
      setMaterialesFiltrados(materiales.filter((m) => m.codigo !== codigo));
    }
  };

  const handleCancelar = () => {
    setMostrarFormulario(false);
    setMaterialEditando(null);
    setFormData({
      codigo: '',
      descripcion: '',
      precioUnitario: 0,
      unidad: 'unidad',
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Gestión de Materiales
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleNuevo}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            + Nuevo Material
          </button>
          <button
            onClick={() => {
              if (confirm('¿Está seguro de resetear todos los materiales a los valores iniciales?')) {
                resetearMateriales();
                setMaterialesFiltrados(materiales);
              }
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Resetear
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 bg-blue-50 p-3 rounded">
        <strong>💾 Base de Datos de Materiales:</strong> Los cambios que realices aquí se guardan
        automáticamente y se aplicarán cuando agregues materiales al presupuesto. Puedes editar
        precios, descripciones y agregar nuevos materiales.
      </p>

      {/* Búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => handleBuscar(e.target.value)}
          placeholder="Buscar materiales..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Formulario de edición/creación */}
      {mostrarFormulario && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-blue-300">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            {materialEditando ? 'Editar Material' : 'Nuevo Material'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código *
              </label>
              <input
                type="text"
                value={formData.codigo}
                onChange={(e) =>
                  setFormData({ ...formData, codigo: e.target.value.toUpperCase() })
                }
                disabled={!!materialEditando}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="PROK02"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unidad
              </label>
              <select
                value={formData.unidad}
                onChange={(e) =>
                  setFormData({ ...formData, unidad: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="unidad">Unidad</option>
                <option value="litro">Litro</option>
                <option value="m2">m²</option>
                <option value="kg">Kg</option>
                <option value="m">Metro</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <input
                type="text"
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción del material"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio Unitario *
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.precioUnitario}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      precioUnitario: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleGuardar}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {materialEditando ? 'Guardar Cambios' : 'Agregar Material'}
            </button>
            <button
              onClick={handleCancelar}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Tabla de materiales */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Código</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Descripción</th>
              <th className="border border-gray-300 px-4 py-2 text-right">Precio Unitario</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Unidad</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {materialesFiltrados.length === 0 ? (
              <tr>
                <td colSpan={5} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                  No se encontraron materiales
                </td>
              </tr>
            ) : (
              materialesFiltrados.map((material) => (
                <tr key={material.codigo} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">
                    {material.codigo}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {material.descripcion}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right font-semibold">
                    {formatearMoneda(material.precioUnitario)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {material.unidad}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEditar(material)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(material.codigo)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

