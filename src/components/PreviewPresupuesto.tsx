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
    total,
    cantidadItems,
    vendedor,
    fechaVencimiento,
  } = presupuesto;

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-5xl mx-auto">
      {/* Encabezado */}
      <div className="mb-6 border-b-2 border-gray-400 pb-4">
        <div className="flex items-start justify-between mb-4">
          {/* Logo y datos empresa (izquierda) */}
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="RH Pisos Industriales"
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  // Fallback si la imagen no se carga
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    target.parentElement.innerHTML = `
                      <div class="w-24 h-24 bg-black rounded-full flex flex-col items-center justify-center border-4 border-green-500">
                        <div class="text-2xl font-bold text-white">RH</div>
                        <div class="text-xs text-white mt-1">PISOS</div>
                        <div class="text-xs text-white">INDUSTRIALES</div>
                      </div>
                    `;
                  }
                }}
              />
            </div>
            <div className="text-sm">
              <p className="font-bold text-base">RH PISOS INDUSTRIALES</p>
              <p>AV. SAN MARTIN 1625, VILLA CRESPO</p>
              <p>TEL: 011-5252-0850</p>
            </div>
          </div>

          {/* PRESUPUESTO y datos (derecha) */}
          <div className="text-right">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">PRESUPUESTO</h1>
            <p className="text-sm font-semibold">N° {numeroPresupuesto}</p>
            <p className="text-sm">FECHA: {formatearFecha(cliente.fecha)}</p>
            <div className="text-xs text-gray-600 mt-2">
              <p>RESPONSABLE INSCRIPTO CUIT: 30705042752</p>
              <p>INICIO ACT.: 04/07/1999 ING. BRUTOS: CM: 30705042752</p>
            </div>
          </div>
        </div>
      </div>

      {/* Datos del Cliente */}
      <div className="mb-6 grid grid-cols-2 gap-6 text-sm">
        <div className="space-y-2">
          <div>
            <span className="font-bold">SEÑOR/ES: </span>
            <span>{cliente.razonSocial || 'CONSUMIDOR FINAL'}</span>
          </div>
          <div>
            <span className="font-bold">DOMICILIO: </span>
            <span>{cliente.domicilio}</span>
          </div>
          <div>
            <span className="font-bold">LOCALIDAD: </span>
            <span>{cliente.localidad || ''}</span>
          </div>
          <div>
            <span className="font-bold">CORREO ELECTRONICO: </span>
            <span>{cliente.email}</span>
          </div>
          <div>
            <span className="font-bold">VENDEDOR: </span>
            <span>{vendedor || ''}</span>
          </div>
          {cliente.observaciones && (
            <div>
              <span className="font-bold">OBSERVACIONES: </span>
              <span>{cliente.observaciones}</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div>
            <span className="font-bold">IVA: </span>
            <span>{cliente.condicionIva}</span>
          </div>
          <div>
            <span className="font-bold">CUIT: </span>
            <span>{cliente.cuit || ''}</span>
          </div>
          <div>
            <span className="font-bold">PROVINCIA: </span>
            <span>{cliente.provincia}</span>
          </div>
          <div>
            <span className="font-bold">TELEFONOS: </span>
            <span>{cliente.telefono}</span>
          </div>
          <div>
            <span className="font-bold">FECHA VENCIMIENTO: </span>
            <span>{fechaVencimiento ? formatearFecha(fechaVencimiento) : ''}</span>
          </div>
        </div>
      </div>

      {/* Línea separadora */}
      <div className="border-t-2 border-gray-400 mb-4"></div>

      {/* Tabla de Items */}
      <div className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 px-3 py-2 text-left text-sm font-bold">
                  Descripcion
                </th>
                <th className="border border-gray-400 px-3 py-2 text-right text-sm font-bold">
                  Cant.
                </th>
                <th className="border border-gray-400 px-3 py-2 text-right text-sm font-bold">
                  Precio Uni.
                </th>
                <th className="border border-gray-400 px-3 py-2 text-right text-sm font-bold">
                  % Desc
                </th>
                <th className="border border-gray-400 px-3 py-2 text-right text-sm font-bold">
                  Sub Total
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="border border-gray-400 px-3 py-2 text-sm">
                    {item.descripcion}
                  </td>
                  <td className="border border-gray-400 px-3 py-2 text-right text-sm">
                    {item.cantidad.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="border border-gray-400 px-3 py-2 text-right text-sm">
                    {formatearMoneda(item.precioUnitario)}
                  </td>
                  <td className="border border-gray-400 px-3 py-2 text-right text-sm">
                    {item.descuento > 0
                      ? `${item.descuento.toFixed(2).replace('.', ',')}%`
                      : '0,00'}
                  </td>
                  <td className="border border-gray-400 px-3 py-2 text-right text-sm font-semibold">
                    {formatearMoneda(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totales */}
      <div className="flex justify-end">
        <div className="w-full md:w-1/3">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-bold">CTD ITEMS:</span>
              <span>{cantidadItems.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">SUBTOTAL:</span>
              <span>{formatearMoneda(subtotalGeneral)}</span>
            </div>
            <div className="border-t-2 border-gray-400 pt-2 mt-2">
              <div className="flex justify-between text-base">
                <span className="font-bold">TOTAL:</span>
                <span className="font-bold">{formatearMoneda(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={() => {
            try {
              generarPDF(presupuesto);
            } catch (error) {
              console.error('Error al generar PDF:', error);
              alert('Error al generar el PDF. Por favor, intente nuevamente.');
            }
          }}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
        >
          Imprimir Presupuesto
        </button>
        <button
          onClick={handleEditar}
          className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-semibold"
        >
          Editar
        </button>
      </div>
    </div>
  );
};
