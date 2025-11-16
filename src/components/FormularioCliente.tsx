import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Cliente, CondicionIVA } from '../types';
import { usePresupuestoStore } from '../store/presupuestoStore';

const schema = yup.object({
  razonSocial: yup.string().required('La razón social es requerida'),
  domicilio: yup.string().required('El domicilio es requerido'),
  localidad: yup.string().required('La localidad es requerida'),
  provincia: yup.string().required('La provincia es requerida'),
  email: yup
    .string()
    .email('Email inválido')
    .required('El email es requerido'),
  telefono: yup.string().required('El teléfono es requerido'),
  fecha: yup.string().required('La fecha es requerida'),
  condicionIva: yup.string().required('La condición de IVA es requerida'),
  cuit: yup
    .string()
    .when('condicionIva', {
      is: (val: string) => val !== 'Consumidor Final',
      then: (schema) =>
        schema
          .matches(/^\d{2}-\d{8}-\d{1}$/, 'Formato de CUIT inválido (XX-XXXXXXXX-X)')
          .required('El CUIT es requerido'),
      otherwise: (schema) => schema,
    }),
  observaciones: yup.string(),
});

const condicionesIVA: CondicionIVA[] = [
  'Responsable Inscripto',
  'Monotributista',
  'Exento',
  'Consumidor Final',
];

export const FormularioCliente = () => {
  const { cliente, setCliente } = usePresupuestoStore();
  const [mostrarFormulario, setMostrarFormulario] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Cliente>({
    resolver: yupResolver(schema),
    defaultValues: cliente || {
      razonSocial: 'CONSUMIDOR FINAL',
      domicilio: 'AV SAN MARTIN 1625',
      localidad: 'VILLA CRESPO',
      provincia: 'CIUDAD AUTONOMA DE BUENOS AIRES',
      email: 'info@rhpisosindustriales.com.ar',
      telefono: '1152520871',
      fecha: new Date().toISOString().split('T')[0],
      condicionIva: 'Consumidor Final',
      cuit: '',
      observaciones: '',
    },
  });


  const onSubmit = (data: Cliente) => {
    setCliente(data);
  };

  const handleLimpiar = () => {
    reset({
      razonSocial: '',
      domicilio: '',
      localidad: '',
      provincia: '',
      email: '',
      telefono: '',
      fecha: new Date().toISOString().split('T')[0],
      condicionIva: 'Responsable Inscripto',
      cuit: '',
      observaciones: '',
    });
    setCliente({
      razonSocial: '',
      domicilio: '',
      localidad: '',
      provincia: '',
      email: '',
      telefono: '',
      fecha: new Date().toISOString().split('T')[0],
      condicionIva: 'Responsable Inscripto',
      cuit: '',
      observaciones: '',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-800">
              Datos del Cliente
            </h2>
            <div className="text-sm text-green-600 font-semibold bg-green-50 px-3 py-1 rounded">
              ✓ Pre-cargados
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {mostrarFormulario ? 'Ocultar' : 'Mostrar/Editar'}
          </button>
        </div>
        {!mostrarFormulario && cliente && (
          <div className="mt-3 text-sm text-gray-600">
            <p><span className="font-semibold">Cliente:</span> {cliente.razonSocial}</p>
            <p><span className="font-semibold">Domicilio:</span> {cliente.domicilio}, {cliente.localidad}</p>
            <p><span className="font-semibold">IVA:</span> {cliente.condicionIva}</p>
          </div>
        )}
      </div>
      {mostrarFormulario && (
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <p className="text-sm text-gray-600 mb-4 bg-blue-50 p-3 rounded">
            Los datos del cliente están pre-configurados. Puedes modificarlos si es necesario.
          </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Razón Social / Nombre *
            </label>
            <input
              type="text"
              {...register('razonSocial')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.razonSocial && (
              <p className="text-red-500 text-xs mt-1">
                {errors.razonSocial.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Domicilio *
            </label>
            <input
              type="text"
              {...register('domicilio')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.domicilio && (
              <p className="text-red-500 text-xs mt-1">
                {errors.domicilio.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Localidad *
            </label>
            <input
              type="text"
              {...register('localidad')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.localidad && (
              <p className="text-red-500 text-xs mt-1">
                {errors.localidad.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Provincia *
            </label>
            <input
              type="text"
              {...register('provincia')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.provincia && (
              <p className="text-red-500 text-xs mt-1">
                {errors.provincia.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono *
            </label>
            <input
              type="tel"
              {...register('telefono')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.telefono && (
              <p className="text-red-500 text-xs mt-1">
                {errors.telefono.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha *
            </label>
            <input
              type="date"
              {...register('fecha')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.fecha && (
              <p className="text-red-500 text-xs mt-1">
                {errors.fecha.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condición IVA *
            </label>
            <select
              {...register('condicionIva')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {condicionesIVA.map((condicion) => (
                <option key={condicion} value={condicion}>
                  {condicion}
                </option>
              ))}
            </select>
            {errors.condicionIva && (
              <p className="text-red-500 text-xs mt-1">
                {errors.condicionIva.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CUIT * (XX-XXXXXXXX-X)
            </label>
            <input
              type="text"
              {...register('cuit')}
              placeholder="20-12345678-9"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.cuit && (
              <p className="text-red-500 text-xs mt-1">
                {errors.cuit.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observaciones
          </label>
          <textarea
            {...register('observaciones')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Guardar Cambios
            </button>
            <button
              type="button"
              onClick={handleLimpiar}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Restaurar Valores
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

