# Instrucciones para Ejecutar la Aplicación

## Problema: Node.js no se reconoce en Cursor

### Solución Rápida: Usar Terminal Externa

1. **Abre PowerShell o CMD** (fuera de Cursor)
2. **Navega al proyecto:**
   ```powershell
   cd C:\Users\alexi\Presupuesto_Sergio
   ```

3. **Instala las dependencias:**
   ```powershell
   npm install
   ```

4. **Ejecuta la aplicación:**
   ```powershell
   npm run dev
   ```

5. **Abre tu navegador** en la URL que aparezca (generalmente `http://localhost:5173`)

---

### Solución Permanente: Verificar/Reinstalar Node.js

#### Verificar si Node.js está instalado:

1. Abre **PowerShell** (fuera de Cursor)
2. Ejecuta: `node --version`
3. Si funciona → El problema es solo en Cursor (reinicia Cursor)
4. Si NO funciona → Node.js no está instalado correctamente

#### Reinstalar Node.js:

1. **Descarga Node.js LTS:**
   - Ve a: https://nodejs.org/
   - Descarga la versión LTS (recomendada)

2. **Instala Node.js:**
   - Ejecuta el instalador
   - ✅ **IMPORTANTE:** Marca la opción "Add to PATH" durante la instalación
   - Completa la instalación

3. **Reinicia Cursor completamente**

4. **Verifica en Cursor:**
   ```powershell
   node --version
   npm --version
   ```

5. **Si funciona, ejecuta:**
   ```powershell
   npm install
   npm run dev
   ```

---

### Alternativa: Usar nvm-windows (Gestor de Versiones)

Si prefieres usar un gestor de versiones:

1. **Descarga nvm-windows:**
   - https://github.com/coreybutler/nvm-windows/releases
   - Descarga `nvm-setup.exe`

2. **Instala nvm-windows**

3. **Abre una nueva terminal y ejecuta:**
   ```powershell
   nvm install lts
   nvm use lts
   ```

4. **Verifica:**
   ```powershell
   node --version
   ```

---

## Comandos Útiles

- `node --version` - Ver versión de Node.js
- `npm --version` - Ver versión de npm
- `npm install` - Instalar dependencias del proyecto
- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción

---

## ¿Necesitas Ayuda?

Si después de seguir estos pasos aún tienes problemas:
1. Verifica que Node.js funcione en una terminal externa
2. Reinicia Cursor completamente
3. Si persiste, reinstala Node.js asegurándote de marcar "Add to PATH"


