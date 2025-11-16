import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Presupuesto } from '../types';
import { formatearMoneda, formatearFecha } from '../utils/formatters';

export const useGenerarPDF = () => {
  const generarPDF = (presupuesto: Presupuesto) => {
    try {
      const doc = new jsPDF();
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

      // Configuración de fuente
      doc.setFont('helvetica');

      // ========== ENCABEZADO ==========
      let yPos = 15;

      // Logo - Posición y dimensiones (óvalo horizontal)
      const logoX = 20;
      const logoY = yPos;
      const logoWidth = 18;
      const logoHeight = 14;
      const centerX = logoX + logoWidth / 2;
      const centerY = logoY + logoHeight / 2;
      const radiusY = logoHeight / 2;

      // Intentar cargar imagen del logo desde /logo.png
      // Nota: jsPDF requiere que la imagen esté cargada antes de usarla
      // Por ahora usamos el fallback (óvalo con texto), pero si el logo existe
      // en /logo.png, se puede mejorar para cargarlo aquí

      // Dibujar óvalo usando círculos en los extremos y rectángulo en el medio
      doc.setFillColor(0, 0, 0); // Fondo negro
      // Círculo izquierdo
      doc.circle(logoX + radiusY, centerY, radiusY, 'F');
      // Rectángulo central
      doc.rect(logoX + radiusY, logoY, logoWidth - 2 * radiusY, logoHeight, 'F');
      // Círculo derecho
      doc.circle(logoX + logoWidth - radiusY, centerY, radiusY, 'F');

      // Borde verde del óvalo
      doc.setDrawColor(0, 255, 0); // Verde
      doc.setLineWidth(1.5);
      // Borde círculo izquierdo
      doc.circle(logoX + radiusY, centerY, radiusY, 'D');
      // Borde rectángulo central
      doc.line(logoX + radiusY, logoY, logoX + radiusY, logoY + logoHeight);
      doc.line(logoX + logoWidth - radiusY, logoY, logoX + logoWidth - radiusY, logoY + logoHeight);
      // Borde círculo derecho
      doc.circle(logoX + logoWidth - radiusY, centerY, radiusY, 'D');

      // Texto dentro del logo (fallback - se reemplazará si hay logo.png)
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255); // Texto blanco
      doc.text('RH', centerX, centerY - 2, { align: 'center' });
      doc.setFontSize(4);
      doc.text('PISOS', centerX, centerY + 2, { align: 'center' });
      doc.text('INDUSTRIALES', centerX, centerY + 5, { align: 'center' });
      doc.setTextColor(0, 0, 0);

      // Datos de la empresa (izquierda, debajo del logo)
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('CYPE ARGENTINA SA', 20, yPos + 20);
      doc.setFont('helvetica', 'normal');
      doc.text('CYPE SAN MARTIN', 20, yPos + 25);
      doc.text('AV. SAN MARTIN 1625, VILLA CRESPO', 20, yPos + 30);
      doc.text('TEL: 011-5252-0850', 20, yPos + 35);

      // Cuadro con X (arriba a la derecha)
      const boxX = 160;
      const boxY = yPos;
      const boxSize = 8;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.rect(boxX, boxY, boxSize, boxSize, 'D');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('X', boxX + boxSize / 2, boxY + boxSize / 2 + 2, { align: 'center' });

      // PRESUPUESTO (derecha, grande)
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text('PRESUPUESTO', 190, yPos + 15, { align: 'right' });

      // Número de presupuesto y fecha (derecha)
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`N° ${numeroPresupuesto.padStart(8, '0')}`, 190, yPos + 22, {
        align: 'right',
      });
      doc.text(`FECHA: ${formatearFecha(cliente.fecha)}`, 190, yPos + 27, {
        align: 'right',
      });

      // Datos adicionales de la empresa (derecha, pequeño)
      doc.setFontSize(7);
      doc.text('RESPONSABLE INSCRIPTO CUIT: 30705042752', 190, yPos + 33, {
        align: 'right',
      });
      doc.text('INICIO ACT.: 04/07/1999 ING. BRUTOS: CM: 30705042752', 190, yPos + 37, {
        align: 'right',
      });

      // Línea separadora después del encabezado
      yPos = yPos + 45;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);
      doc.line(20, yPos, 190, yPos);
      yPos += 8;

      // ========== DATOS DEL CLIENTE ==========
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');

      // Columna izquierda - Ajustar posiciones para evitar sobreposición
      const leftLabelX = 20;
      const leftValueX = 50;
      const leftMaxWidth = 85; // Ancho máximo para valores de la columna izquierda
      const lineHeight = 5; // Altura de línea base

      let currentY = yPos;

      // SEÑOR/ES
      doc.setFont('helvetica', 'bold');
      doc.text('SEÑOR/ES:', leftLabelX, currentY);
      doc.setFont('helvetica', 'normal');
      const razonSocialText = cliente.razonSocial || 'CONSUMIDOR FINAL';
      const razonSocialLines = doc.splitTextToSize(razonSocialText, leftMaxWidth);
      if (Array.isArray(razonSocialLines)) {
        razonSocialLines.forEach((line, idx) => {
          doc.text(line, leftValueX, currentY + idx * lineHeight);
        });
        currentY += razonSocialLines.length * lineHeight;
      } else {
        doc.text(razonSocialLines, leftValueX, currentY);
        currentY += lineHeight;
      }

      // DOMICILIO
      doc.setFont('helvetica', 'bold');
      doc.text('DOMICILIO:', leftLabelX, currentY);
      doc.setFont('helvetica', 'normal');
      const domicilioLines = doc.splitTextToSize(cliente.domicilio, leftMaxWidth);
      if (Array.isArray(domicilioLines)) {
        domicilioLines.forEach((line, idx) => {
          doc.text(line, leftValueX, currentY + idx * lineHeight);
        });
        currentY += domicilioLines.length * lineHeight;
      } else {
        doc.text(domicilioLines, leftValueX, currentY);
        currentY += lineHeight;
      }

      // LOCALIDAD
      doc.setFont('helvetica', 'bold');
      doc.text('LOCALIDAD:', leftLabelX, currentY);
      doc.setFont('helvetica', 'normal');
      const localidadLines = doc.splitTextToSize(cliente.localidad || '', leftMaxWidth);
      if (Array.isArray(localidadLines)) {
        localidadLines.forEach((line, idx) => {
          doc.text(line, leftValueX, currentY + idx * lineHeight);
        });
        currentY += localidadLines.length * lineHeight;
      } else {
        doc.text(localidadLines, leftValueX, currentY);
        currentY += lineHeight;
      }

      // CORREO ELECTRONICO
      doc.setFont('helvetica', 'bold');
      doc.text('CORREO ELECTRONICO:', leftLabelX, currentY);
      doc.setFont('helvetica', 'normal');
      const emailLines = doc.splitTextToSize(cliente.email || '', leftMaxWidth);
      if (Array.isArray(emailLines)) {
        emailLines.forEach((line, idx) => {
          doc.text(line, leftValueX, currentY + idx * lineHeight);
        });
        currentY += emailLines.length * lineHeight;
      } else {
        doc.text(emailLines, leftValueX, currentY);
        currentY += lineHeight;
      }

      // VENDEDOR
      doc.setFont('helvetica', 'bold');
      doc.text('VENDEDOR:', leftLabelX, currentY);
      doc.setFont('helvetica', 'normal');
      const vendedorLines = doc.splitTextToSize(vendedor || '', leftMaxWidth);
      if (Array.isArray(vendedorLines)) {
        vendedorLines.forEach((line, idx) => {
          doc.text(line, leftValueX, currentY + idx * lineHeight);
        });
        currentY += vendedorLines.length * lineHeight;
      } else {
        doc.text(vendedorLines, leftValueX, currentY);
        currentY += lineHeight;
      }

      // OBSERVACIONES
      doc.setFont('helvetica', 'bold');
      doc.text('OBSERVACIONES:', leftLabelX, currentY);
      doc.setFont('helvetica', 'normal');
      if (cliente.observaciones) {
        const obsLines = doc.splitTextToSize(cliente.observaciones, leftMaxWidth);
        if (Array.isArray(obsLines)) {
          obsLines.forEach((line, idx) => {
            doc.text(line, leftValueX, currentY + 5 + idx * lineHeight);
          });
          currentY += obsLines.length * lineHeight + 5;
        } else {
          doc.text(obsLines, leftValueX, currentY + 5);
          currentY += lineHeight + 5;
        }
      } else {
        currentY += lineHeight;
      }

      // Columna derecha - Ajustar posiciones para evitar sobreposición
      const rightLabelX = 110;
      const rightValueX = 130; // Más espacio para evitar sobreposición
      const rightMaxWidth = 60; // Ancho máximo para valores de la columna derecha

      let rightY = yPos;

      // IVA
      doc.setFont('helvetica', 'bold');
      doc.text('IVA:', rightLabelX, rightY);
      doc.setFont('helvetica', 'normal');
      const ivaLines = doc.splitTextToSize(cliente.condicionIva, rightMaxWidth);
      if (Array.isArray(ivaLines)) {
        ivaLines.forEach((line, idx) => {
          doc.text(line, rightValueX, rightY + idx * lineHeight);
        });
        rightY += ivaLines.length * lineHeight;
      } else {
        doc.text(ivaLines, rightValueX, rightY);
        rightY += lineHeight;
      }

      // CUIT
      doc.setFont('helvetica', 'bold');
      doc.text('CUIT:', rightLabelX, rightY);
      doc.setFont('helvetica', 'normal');
      const cuitLines = doc.splitTextToSize(cliente.cuit || '', rightMaxWidth);
      if (Array.isArray(cuitLines)) {
        cuitLines.forEach((line, idx) => {
          doc.text(line, rightValueX, rightY + idx * lineHeight);
        });
        rightY += cuitLines.length * lineHeight;
      } else {
        doc.text(cuitLines, rightValueX, rightY);
        rightY += lineHeight;
      }

      // PROVINCIA
      doc.setFont('helvetica', 'bold');
      doc.text('PROVINCIA:', rightLabelX, rightY);
      doc.setFont('helvetica', 'normal');
      const provinciaLines = doc.splitTextToSize(cliente.provincia, rightMaxWidth);
      if (Array.isArray(provinciaLines)) {
        provinciaLines.forEach((line, idx) => {
          doc.text(line, rightValueX, rightY + idx * lineHeight);
        });
        rightY += provinciaLines.length * lineHeight;
      } else {
        doc.text(provinciaLines, rightValueX, rightY);
        rightY += lineHeight;
      }

      // TELEFONOS
      doc.setFont('helvetica', 'bold');
      doc.text('TELEFONOS:', rightLabelX, rightY);
      doc.setFont('helvetica', 'normal');
      const telefonoLines = doc.splitTextToSize(cliente.telefono, rightMaxWidth);
      if (Array.isArray(telefonoLines)) {
        telefonoLines.forEach((line, idx) => {
          doc.text(line, rightValueX, rightY + idx * lineHeight);
        });
        rightY += telefonoLines.length * lineHeight;
      } else {
        doc.text(telefonoLines, rightValueX, rightY);
        rightY += lineHeight;
      }

      // FECHA VENCIMIENTO
      doc.setFont('helvetica', 'bold');
      doc.text('FECHA VENCIMIENTO:', rightLabelX, rightY);
      doc.setFont('helvetica', 'normal');
      const fechaVencText = fechaVencimiento ? formatearFecha(fechaVencimiento) : '';
      const fechaVencLines = doc.splitTextToSize(fechaVencText, rightMaxWidth);
      if (Array.isArray(fechaVencLines)) {
        fechaVencLines.forEach((line, idx) => {
          doc.text(line, rightValueX, rightY + idx * lineHeight);
        });
        rightY += fechaVencLines.length * lineHeight;
      } else {
        doc.text(fechaVencLines, rightValueX, rightY);
        rightY += lineHeight;
      }

      // Línea separadora después de datos del cliente
      // Usar el máximo entre las dos columnas para la posición Y
      yPos = Math.max(currentY, rightY) + 5;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);
      doc.line(20, yPos, 190, yPos);
      yPos += 8;

      // ========== TABLA DE ITEMS ==========
      // Función helper para formatear números (punto para miles, coma para decimales)
      const formatearNumero = (num: number): string => {
        const partes = num.toFixed(2).split('.');
        const parteEntera = partes[0];
        const parteDecimal = partes[1];
        const parteEnteraFormateada = parteEntera
          .split('')
          .reverse()
          .reduce((acc, digito, index) => {
            if (index > 0 && index % 3 === 0) {
              return digito + '.' + acc;
            }
            return digito + acc;
          }, '');
        return `${parteEnteraFormateada},${parteDecimal}`;
      };

      // Formatear datos de la tabla
      const tableData = items.map((item) => {
        // Formatear precio unitario sin el símbolo $ (solo números con formato)
        const precioFormateado = formatearNumero(item.precioUnitario);
        
        // Formatear descuento (sin % en la tabla, solo el número)
        const descFormateado = item.descuento > 0 
          ? formatearNumero(item.descuento)
          : '0,00';
        
        // Formatear subtotal sin el símbolo $ (solo números con formato)
        const subtotalFormateado = formatearNumero(item.subtotal);
        
        // Formatear cantidad
        const cantidadFormateada = formatearNumero(item.cantidad);
        
        // Descripción con guión al final si no termina en guión
        const descripcion = item.descripcion.trim().endsWith('-') 
          ? item.descripcion.trim() 
          : item.descripcion.trim() + ' -';
        
        return [
          descripcion,
          cantidadFormateada,
          precioFormateado,
          descFormateado,
          subtotalFormateado,
        ];
      });

      autoTable(doc, {
        startY: yPos,
        head: [['Descripcion', 'Cant.', 'Precio Uni.', '% Desc', 'Sub Total']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          fontSize: 9,
          halign: 'center',
        },
        bodyStyles: {
          fontSize: 8,
        },
        columnStyles: {
          0: { cellWidth: 85, halign: 'left' },
          1: { cellWidth: 18, halign: 'right' },
          2: { cellWidth: 28, halign: 'right' },
          3: { cellWidth: 22, halign: 'right' },
          4: { cellWidth: 28, halign: 'right' },
        },
        styles: {
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
        },
        margin: { left: 20, right: 20 },
      });

      const finalY = (doc as any).lastAutoTable.finalY || yPos + 50;

      // ========== TOTALES ==========
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      let totalY = finalY + 8;

      // CTD ITEMS
      doc.setFont('helvetica', 'bold');
      doc.text('CTD ITEMS:', 150, totalY);
      doc.setFont('helvetica', 'normal');
      doc.text(cantidadItems.toFixed(2).replace('.', ','), 190, totalY, {
        align: 'right',
      });
      totalY += 6;

      // SUBTOTAL
      doc.setFont('helvetica', 'bold');
      doc.text('SUBTOTAL:', 150, totalY);
      doc.setFont('helvetica', 'normal');
      doc.text(formatearMoneda(subtotalGeneral), 190, totalY, { align: 'right' });
      totalY += 6;

      // TOTAL
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL:', 150, totalY);
      doc.text(formatearMoneda(total), 190, totalY, { align: 'right' });

      // Guardar PDF
      const fileName = `Presupuesto_${numeroPresupuesto}_${cliente.razonSocial
        .replace(/\s+/g, '_')
        .substring(0, 20)}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Por favor, verifica la consola para más detalles.');
    }
  };

  return { generarPDF };
};
