# Instrucciones para agregar el logo

## 📁 Ubicación del logo

Coloca la imagen del logo de **RH Pisos Industriales** en la siguiente ubicación:

```
public/logo.png
```

## 📋 Especificaciones

- **Nombre del archivo:** `logo.png`
- **Formatos soportados:** PNG (recomendado), JPG, SVG
- **Tamaño recomendado:** 
  - Mínimo: 200x200px
  - Ideal: 400x400px o mayor para mejor calidad
- **Fondo:** El logo debe tener fondo transparente o fondo negro (según el diseño)

## ✅ Verificación

Una vez que coloques el logo:

1. **Favicon:** El logo aparecerá automáticamente en la pestaña del navegador
2. **Preview:** El logo aparecerá en la previsualización del presupuesto
3. **PDF:** El logo se incluirá automáticamente en el PDF generado

## 🔄 Si el logo no aparece

Si el logo no se carga:
- Verifica que el archivo esté en `public/logo.png`
- Verifica que el nombre del archivo sea exactamente `logo.png` (minúsculas)
- Reinicia el servidor de desarrollo (`npm run dev`)
- Limpia la caché del navegador (Ctrl+Shift+R)

## 📝 Nota

El sistema tiene un fallback automático que mostrará un logo simple con "RH PISOS INDUSTRIALES" si la imagen no se carga correctamente.

