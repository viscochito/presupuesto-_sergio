import { usePresupuestoStore } from '../store/presupuestoStore';
import { formatearMoneda, formatearFecha } from '../utils/formatters';
import { useGenerarPDF } from '../hooks/useGenerarPDF';

interface PreviewPresupuestoProps {
  onEditar?: () => void;
}

export const PreviewPresupuesto = ({ onEditar }: PreviewPresupuestoProps) => {
  const { presupuesto } = usePresupuestoStore();
  const { generarPDF } = useGenerarPDF();

  const handleEditar = () => {
    if (onEditar) {
      onEditar();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!presupuesto) {
    return null;
  }

  const {
    numeroPresupuesto,
    cliente,
    items,
    subtotalGeneral,
    impuestos = 0,
    total,
    cantidadItems,
    condiciones = 'Duración del trabajo: 2 DIAS\nAdelanto el 50% y el resto al finalizar el trabajo',
  } = presupuesto;

  return (
    <div id="presupuesto-preview" className="presupuesto-container bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg max-w-5xl mx-auto">
      {/* Encabezado */}
      <div className="presupuesto-header presupuesto-no-break mb-4 sm:mb-6 border-b-2 border-gray-400 pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-0 mb-4">
          {/* Logo y datos empresa (izquierda) */}
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="presupuesto-logo w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center flex-shrink-0">
              <img
                src="/image.png"
                alt="RH Pisos Industriales"
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    target.parentElement.innerHTML = `
                      <div class="w-full h-full bg-black rounded-full flex flex-col items-center justify-center border-4 border-green-500">
                        <div class="text-lg sm:text-xl md:text-2xl font-bold text-white">RH</div>
                        <div class="text-xs text-white mt-1">PISOS</div>
                        <div class="text-xs text-white">INDUSTRIALES</div>
                      </div>
                    `;
                  }
                }}
              />
            </div>
            <div className="presupuesto-header-text text-xs sm:text-sm">
              <p className="presupuesto-bold font-bold">Empresa:</p>
              <p className="mb-1 sm:mb-2">Pisos Industriales S.A.</p>
              <p className="presupuesto-bold font-bold">Dirección:</p>
              <p className="mb-1 sm:mb-2">Av. Industrial 1234, CABA</p>
              <p className="presupuesto-bold font-bold">Teléfono:</p>
              <p className="mb-1 sm:mb-2">(011) 1234-5678</p>
              <p className="presupuesto-bold font-bold">Email:</p>
              <p className="break-all">contacto@pisosindustriales.com.ar</p>
            </div>
          </div>

          {/* PRESUPUESTO y datos (derecha) */}
          <div className="text-left sm:text-right">
            <h1 className="presupuesto-title text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">PRESUPUESTO</h1>
            <p className="presupuesto-text-base text-sm sm:text-base mb-1 sm:mb-2">Pisos Industriales</p>
            <p className="presupuesto-text-sm text-xs sm:text-sm font-semibold">N° {numeroPresupuesto}</p>
            <p className="presupuesto-text-sm text-xs sm:text-sm">FECHA: {formatearFecha(cliente.fecha)}</p>
          </div>
        </div>
      </div>

      {/* Línea separadora después del encabezado */}
      <div className="presupuesto-divider border-t-2 border-gray-400 mb-4"></div>

      {/* Datos del Cliente */}
      <div className="presupuesto-section presupuesto-no-break mb-4 sm:mb-6">
        <h2 className="presupuesto-section-title text-base sm:text-lg font-bold mb-2 sm:mb-3 text-gray-800">Datos del Cliente</h2>
        <div className="presupuesto-cliente-grid grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-xs sm:text-sm">
          {/* Columna izquierda */}
          <div className="presupuesto-cliente-col presupuesto-space-y-2 space-y-2">
            <div>
              <span className="presupuesto-bold font-bold">Razón Social: </span>
              <span>{cliente.razonSocial || 'CONSUMIDOR FINAL'}</span>
            </div>
            <div>
              <span className="presupuesto-bold font-bold">CUIT: </span>
              <span>{cliente.cuit || ''}</span>
            </div>
            <div>
              <span className="presupuesto-bold font-bold">Domicilio: </span>
              <span>{cliente.domicilio}</span>
            </div>
            <div>
              <span className="presupuesto-bold font-bold">Localidad: </span>
              <span>{cliente.localidad || ''}</span>
            </div>
            <div>
              <span className="presupuesto-bold font-bold">Provincia: </span>
              <span>{cliente.provincia}</span>
            </div>
          </div>
          
          {/* Columna derecha */}
          <div className="presupuesto-cliente-col presupuesto-space-y-2 space-y-2">
            <div>
              <span className="presupuesto-bold font-bold">Fecha: </span>
              <span>{formatearFecha(cliente.fecha)}</span>
            </div>
            <div>
              <span className="presupuesto-bold font-bold">Condición IVA: </span>
              <span>{cliente.condicionIva}</span>
            </div>
            <div>
              <span className="presupuesto-bold font-bold">Teléfono: </span>
              <span>{cliente.telefono}</span>
            </div>
            <div>
              <span className="presupuesto-bold font-bold">Email: </span>
              <span>{cliente.email}</span>
            </div>
            {cliente.observaciones && cliente.observaciones.trim() && (
              <div>
                <span className="presupuesto-bold font-bold">Observaciones: </span>
                <span>{cliente.observaciones}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Línea separadora después de datos del cliente */}
      <div className="presupuesto-divider border-t-2 border-gray-400 mb-4"></div>

      {/* Detalle del Presupuesto */}
      <div className="presupuesto-section mb-4 sm:mb-6">
        <h2 className="presupuesto-section-title text-base sm:text-lg font-bold mb-2 sm:mb-3 text-gray-800">Detalle del Presupuesto</h2>
        <div className="presupuesto-table-container overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle px-4 sm:px-0">
            <table className="presupuesto-table w-full border-collapse border border-gray-400 min-w-[500px]">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-400 px-2 sm:px-3 py-1.5 sm:py-2 text-right text-xs sm:text-sm font-bold">
                    Cant.
                  </th>
                  <th className="border border-gray-400 px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs sm:text-sm font-bold">
                    Descripción
                  </th>
                  <th className="border border-gray-400 px-2 sm:px-3 py-1.5 sm:py-2 text-right text-xs sm:text-sm font-bold">
                    Precio Uni.
                  </th>
                  <th className="border border-gray-400 px-2 sm:px-3 py-1.5 sm:py-2 text-right text-xs sm:text-sm font-bold">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={item.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="presupuesto-text-sm border border-gray-400 px-2 sm:px-3 py-1.5 sm:py-2 text-right text-xs sm:text-sm">
                      {item.cantidad.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="presupuesto-text-sm border border-gray-400 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm">
                      {item.descripcion}
                    </td>
                    <td className="presupuesto-text-sm border border-gray-400 px-2 sm:px-3 py-1.5 sm:py-2 text-right text-xs sm:text-sm">
                      {formatearMoneda(item.precioUnitario)}
                    </td>
                    <td className="presupuesto-text-sm presupuesto-bold border border-gray-400 px-2 sm:px-3 py-1.5 sm:py-2 text-right text-xs sm:text-sm font-semibold">
                      {formatearMoneda(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Totales y Condiciones */}
      <div className="presupuesto-totales-grid presupuesto-no-break grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
        {/* Columna Izquierda - Términos y Condiciones */}
        <div className="presupuesto-totales-col">
          <h3 className="presupuesto-section-title text-sm sm:text-base font-bold mb-2 sm:mb-3 text-gray-800">Términos y Condiciones</h3>
          <div className="presupuesto-condiciones presupuesto-text-sm text-xs sm:text-sm whitespace-pre-line text-gray-700">
            {condiciones.split('\n').map((line, index) => (
              <div key={index} className="mb-1">
                {line}
              </div>
            ))}
          </div>
        </div>

        {/* Columna Derecha - Resumen Financiero */}
        <div className="presupuesto-totales-col flex justify-start sm:justify-end">
          <div className="presupuesto-resumen w-full sm:w-2/3">
            <div className="presupuesto-space-y-2 space-y-2 text-xs sm:text-sm">
              <div className="presupuesto-resumen-item flex justify-between">
                <span className="presupuesto-bold presupuesto-text-sm font-bold">Cantidad de Items:</span>
                <span className="presupuesto-text-sm">{cantidadItems.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="presupuesto-resumen-item flex justify-between">
                <span className="presupuesto-bold presupuesto-text-sm font-bold">Subtotal General:</span>
                <span className="presupuesto-text-sm">{formatearMoneda(subtotalGeneral)}</span>
              </div>
              <div className="presupuesto-resumen-item flex justify-between">
                <span className="presupuesto-bold presupuesto-text-sm font-bold">Impuestos (IVA):</span>
                <span className="presupuesto-text-sm">{formatearMoneda(impuestos)}</span>
              </div>
              <div className="presupuesto-total border-t-2 border-gray-400 pt-2 mt-2">
                <div className="presupuesto-resumen-item flex justify-between text-base">
                  <span className="presupuesto-bold font-bold">Total:</span>
                  <span className="presupuesto-bold font-bold">{formatearMoneda(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de Acción - Solo visible en pantalla */}
      <div className="no-print flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
        <button
          onClick={async () => {
            try {
              await generarPDF(presupuesto);
            } catch (error) {
              console.error('Error al generar PDF:', error);
              alert('Error al generar el PDF. Por favor, intente nuevamente.');
            }
          }}
          className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold text-sm sm:text-base"
        >
          Imprimir Presupuesto
        </button>
        <button
          onClick={handleEditar}
          className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-semibold text-sm sm:text-base"
        >
          Editar
        </button>
      </div>
    </div>
  );
};
