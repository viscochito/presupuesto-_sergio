# Sistema de Presupuestos - Pisos Industriales

Sistema completo de generación de presupuestos desarrollado con React + TypeScript, que permite a los asesores comerciales crear presupuestos profesionales de forma rápida y eficiente.

## 🚀 Características

- ✅ Formulario completo de datos del cliente con validaciones
- ✅ Tabla editable de items con cálculo automático de subtotales
- ✅ Previsualización del presupuesto en tiempo real
- ✅ Generación de PDF profesional listo para imprimir
- ✅ Diseño responsivo y moderno
- ✅ Arquitectura limpia y escalable

## 📋 Requisitos

- Node.js 18+ 
- npm o yarn

## 🛠️ Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar en modo desarrollo:
```bash
npm run dev
```

3. Construir para producción:
```bash
npm run build
```

## 📦 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── FormularioCliente.tsx
│   ├── TablaItems.tsx
│   └── PreviewPresupuesto.tsx
├── pages/              # Páginas de la aplicación
│   └── HomePage.tsx
├── hooks/              # Hooks personalizados
│   └── useGenerarPDF.ts
├── store/              # Estado global (Zustand)
│   └── presupuestoStore.ts
├── types/              # Tipos TypeScript
│   └── index.ts
├── utils/              # Funciones auxiliares
│   ├── calculations.ts
│   └── formatters.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 🎯 Uso

1. **Completar datos del cliente**: Complete todos los campos requeridos del formulario de cliente
2. **Agregar items**: Use la tabla de items para agregar productos/servicios con cantidad, precio y descuento
3. **Calcular cotización**: Haga clic en "Calcular Cotización" para generar la previsualización
4. **Revisar y editar**: Revise el presupuesto generado y use "Editar" si necesita hacer cambios
5. **Imprimir**: Haga clic en "Imprimir Presupuesto" para generar y descargar el PDF

## 🧩 Tecnologías Utilizadas

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Zustand** - Manejo de estado global
- **React Hook Form** - Manejo de formularios
- **Yup** - Validación de esquemas
- **Tailwind CSS** - Estilos utilitarios
- **jsPDF** - Generación de PDFs
- **jspdf-autotable** - Tablas en PDFs

## 📝 Validaciones

El sistema incluye validaciones para:
- Razón social, domicilio, localidad, provincia (requeridos)
- Email (formato válido)
- CUIT (formato XX-XXXXXXXX-X)
- Teléfono (requerido)
- Items con cantidad y precio mayor a 0

## 🎨 Características del PDF

- Encabezado con datos de la empresa
- Información completa del cliente
- Tabla detallada de items
- Cálculo automático de subtotales y totales
- Formato profesional listo para imprimir

## 📄 Licencia

Este proyecto es de uso interno.


