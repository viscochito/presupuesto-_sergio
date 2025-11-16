import { useState } from 'react';
import { FormularioCliente } from '../components/FormularioCliente';
import { TablaItems } from '../components/TablaItems';
import { PreviewPresupuesto } from '../components/PreviewPresupuesto';
import { GestionMateriales } from '../components/GestionMateriales';
import { usePresupuestoStore } from '../store/presupuestoStore';

export const HomePage = () => {
  const {
    cliente,
    items,
    calcularPresupuesto,
    limpiarTodo,
    presupuesto,
    vendedor,
    fechaVencimiento,
    setVendedor,
    setFechaVencimiento,
  } = usePresupuestoStore();
  const [mostrarPreview, setMostrarPreview] = useState(false);
  const [mostrarGestionMateriales, setMostrarGestionMateriales] = useState(false);

  const handleCalcularCotizacion = () => {
    if (items.length === 0) {
      alert('Por favor, agregue al menos un material al presupuesto');
      return;
    }

    // Asegurar que el cliente esté guardado
    if (cliente) {
      calcularPresupuesto();
      setMostrarPreview(true);
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  const handleLimpiar = () => {
    if (confirm('¿Está seguro de limpiar todos los datos?')) {
      limpiarTodo();
      setMostrarPreview(false);
    }
  };

  const handleEditar = () => {
    setMostrarPreview(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img
              src="/logo.png"
              alt="RH Pisos Industriales"
              className="h-16 w-16 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Sistema de Presupuestos
              </h1>
              <p className="text-gray-600">
                RH Pisos Industriales - Generación de Presupuestos
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-8">
          {/* Botón para gestionar materiales */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <button
              onClick={() => setMostrarGestionMateriales(!mostrarGestionMateriales)}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-semibold"
            >
              {mostrarGestionMateriales ? 'Ocultar' : 'Gestionar'} Base de Datos de Materiales
            </button>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Administra precios, descripciones y materiales. Los cambios se guardan automáticamente.
            </p>
          </div>

          {/* Gestión de Materiales */}
          {mostrarGestionMateriales && (
            <GestionMateriales />
          )}

          {/* Formulario de Cliente */}
          <FormularioCliente />

          {/* Campos adicionales */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Información Adicional
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendedor
                </label>
                <input
                  type="text"
                  value={vendedor}
                  onChange={(e) => setVendedor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre del vendedor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Vencimiento
                </label>
                <input
                  type="date"
                  value={fechaVencimiento}
                  onChange={(e) => setFechaVencimiento(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Tabla de Items */}
          <TablaItems />

          {/* Botones de Acción */}
          <div className="bg-white p-6 rounded-lg shadow-md flex gap-4 justify-center">
            <button
              onClick={handleCalcularCotizacion}
              className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              Calcular Cotización
            </button>
            <button
              onClick={handleLimpiar}
              className="px-8 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-semibold text-lg"
            >
              Limpiar
            </button>
          </div>

          {/* Preview del Presupuesto */}
          {mostrarPreview && presupuesto && (
            <div className="mt-8">
              <PreviewPresupuesto onEditar={handleEditar} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

