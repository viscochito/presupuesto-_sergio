import { useState, useEffect } from 'react';
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
  } = usePresupuestoStore();
  const [mostrarPreview, setMostrarPreview] = useState(false);
  const [mostrarGestionMateriales, setMostrarGestionMateriales] = useState(false);

  // Prevenir scroll del body cuando algún modal está abierto
  useEffect(() => {
    if (mostrarPreview || mostrarGestionMateriales) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mostrarPreview, mostrarGestionMateriales]);

  const handleCalcularCotizacion = () => {
    if (items.length === 0) {
      alert('Por favor, agregue al menos un material al presupuesto');
      return;
    }

    // Asegurar que el cliente esté guardado
    if (cliente) {
      calcularPresupuesto();
      setMostrarPreview(true);
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
  };

  const handleCerrarModal = () => {
    setMostrarPreview(false);
  };

  const handleCerrarModalMateriales = () => {
    setMostrarGestionMateriales(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4 sm:py-8">
      <div className="container mx-auto px-2 sm:px-4 max-w-6xl">
        <header className="mb-4 sm:mb-8 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4">
            <img
              src="/logo.png"
              alt="RH Pisos Industriales"
              className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">
                Sistema de Presupuestos
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                RH Pisos Industriales - Generación de Presupuestos
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-4 sm:space-y-8">
          {/* Formulario de Cliente */}
          <FormularioCliente />

          {/* Tabla de Items */}
          <TablaItems 
            onToggleGestionMateriales={() => setMostrarGestionMateriales(!mostrarGestionMateriales)}
          />

          {/* Botones de Acción */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={handleCalcularCotizacion}
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold text-base sm:text-lg"
            >
              Calcular Cotización
            </button>
            <button
              onClick={handleLimpiar}
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-semibold text-base sm:text-lg"
            >
              Limpiar
            </button>
          </div>

        </div>
      </div>

      {/* Modal/Overlay para la Previsualización */}
      {mostrarPreview && presupuesto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50 backdrop-blur-sm modal-overlay-enter transition-opacity duration-300"
          onClick={handleCerrarModal}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[98vh] sm:max-h-[95vh] overflow-y-auto relative modal-content-enter transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón de cerrar */}
            <button
              onClick={handleCerrarModal}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 text-gray-500 hover:text-gray-700 bg-white rounded-full p-1.5 sm:p-2 shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Cerrar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Contenido de la previsualización */}
            <div className="p-2 sm:p-4">
              <PreviewPresupuesto onEditar={handleEditar} />
            </div>
          </div>
        </div>
      )}

      {/* Modal/Overlay para Gestión de Materiales */}
      {mostrarGestionMateriales && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50 backdrop-blur-sm modal-overlay-enter transition-opacity duration-300"
          onClick={handleCerrarModalMateriales}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[98vh] sm:max-h-[95vh] overflow-y-auto relative modal-content-enter transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón de cerrar */}
            <button
              onClick={handleCerrarModalMateriales}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 text-gray-500 hover:text-gray-700 bg-white rounded-full p-1.5 sm:p-2 shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Cerrar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Contenido de gestión de materiales */}
            <div className="p-2 sm:p-4">
              <GestionMateriales />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

