# Script para verificar la instalacion de Node.js
Write-Host "Buscando Node.js..." -ForegroundColor Yellow

# Buscar en ubicaciones comunes
$rutas = @(
    "C:\Program Files\nodejs\node.exe",
    "C:\Program Files (x86)\nodejs\node.exe",
    "$env:LOCALAPPDATA\Programs\nodejs\node.exe",
    "$env:APPDATA\npm\node.exe"
)

$encontrado = $false
foreach ($ruta in $rutas) {
    if (Test-Path $ruta) {
        Write-Host "Node.js encontrado en: $ruta" -ForegroundColor Green
        $encontrado = $true
        & $ruta --version
        break
    }
}

if (-not $encontrado) {
    Write-Host "Node.js no encontrado en las ubicaciones comunes" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, verifica:" -ForegroundColor Yellow
    Write-Host "1. Que Node.js este instalado correctamente"
    Write-Host "2. Que la instalacion incluya 'Add to PATH'"
    Write-Host "3. Reinicia Cursor despues de instalar Node.js"
}

# Verificar PATH
Write-Host ""
Write-Host "Variables de PATH actuales:" -ForegroundColor Cyan
$pathParts = $env:PATH -split ';'
foreach ($part in $pathParts) {
    if ($part -like '*node*') {
        Write-Host "  - $part"
    }
}
