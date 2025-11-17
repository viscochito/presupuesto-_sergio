import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Presupuesto } from '../types';
import { formatearMoneda, formatearFecha } from '../utils/formatters';

// Función para cargar la imagen del logo y convertirla a base64
const loadLogoImage = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Intentar cargar usando fetch primero (más robusto)
    fetch('/image.png')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          resolve(base64data);
        };
        reader.onerror = () => {
          reject(new Error('Error al leer el archivo del logo'));
        };
        reader.readAsDataURL(blob);
      })
      .catch(() => {
        // Si fetch falla, intentar con Image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              const dataURL = canvas.toDataURL('image/png');
              resolve(dataURL);
            } else {
              reject(new Error('No se pudo obtener el contexto del canvas'));
            }
          } catch (error) {
            reject(error);
          }
        };
        
        img.onerror = () => {
          reject(new Error('No se pudo cargar la imagen del logo desde /image.png'));
        };
        
        img.src = '/image.png';
      });
  });
};

export const useGenerarPDF = () => {
  const generarPDF = async (presupuesto: Presupuesto) => {
    try {
      const doc = new jsPDF();
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

      // Configuración de fuente
      doc.setFont('helvetica');

      // Dimensiones A4: 210mm x 297mm
      const pageWidth = 210;
      const margin = 15; // Márgenes simétricos
      const contentWidth = pageWidth - (margin * 2); // 180mm
      const leftMargin = margin; // 15mm
      const rightMargin = pageWidth - margin; // 195mm

      // ========== ENCABEZADO ==========
      let yPos = 12; // Posición inicial más arriba

      // Logo - Cargar imagen real
      const logoX = leftMargin;
      const logoY = yPos;
      const logoWidthMM = 20; // Ancho del logo en mm
      const logoHeightMM = 20; // Alto del logo en mm

      try {
        // Intentar cargar la imagen del logo
        const logoDataUrl = await loadLogoImage();
        doc.addImage(logoDataUrl, 'PNG', logoX, logoY, logoWidthMM, logoHeightMM);
      } catch (error) {
        console.warn('⚠️ No se pudo cargar el logo desde /image.png');
        console.warn('💡 Asegúrate de que el archivo image.png esté en la carpeta public/');
        console.warn('📁 Ruta esperada: public/image.png');
        // Logo de respaldo: óvalo negro con borde verde
        const logoCenterX = logoX + logoWidthMM / 2;
        const logoCenterY = logoY + logoHeightMM / 2;
        const radiusX = logoWidthMM / 2;
        const radiusY = logoHeightMM / 2;
        
        doc.setFillColor(0, 0, 0);
        doc.ellipse(logoCenterX, logoCenterY, radiusX, radiusY, 'F');
        doc.setDrawColor(34, 197, 94);
        doc.setLineWidth(0.8);
        doc.ellipse(logoCenterX, logoCenterY, radiusX, radiusY, 'D');
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text('RH', logoCenterX, logoCenterY - 2.5, { align: 'center' });
        doc.setFontSize(5);
        doc.text('PISOS', logoCenterX, logoCenterY + 2, { align: 'center' });
        doc.text('INDUSTRIALES', logoCenterX, logoCenterY + 5, { align: 'center' });
        doc.setTextColor(0, 0, 0);
      }

      // Datos de la empresa (izquierda)
      const empresaX = logoX + logoWidthMM + 6;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('Empresa:', empresaX, yPos + 4);
      doc.setFont('helvetica', 'normal');
      doc.text('Pisos Industriales S.A.', empresaX, yPos + 8);
      doc.setFont('helvetica', 'bold');
      doc.text('Dirección:', empresaX, yPos + 12);
      doc.setFont('helvetica', 'normal');
      doc.text('Av. Industrial 1234, CABA', empresaX, yPos + 16);
      doc.setFont('helvetica', 'bold');
      doc.text('Teléfono:', empresaX, yPos + 20);
      doc.setFont('helvetica', 'normal');
      doc.text('(011) 1234-5678', empresaX, yPos + 24);
      doc.setFont('helvetica', 'bold');
      doc.text('Email:', empresaX, yPos + 28);
      doc.setFont('helvetica', 'normal');
      doc.text('contacto@pisosindustriales.com.ar', empresaX, yPos + 32);

      // PRESUPUESTO (derecha, alineado al margen derecho)
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      const presupuestoY = yPos + 6; // Ajustado un poco más arriba
      doc.text('PRESUPUESTO', rightMargin, presupuestoY, { align: 'right' });
      
      // Pisos Industriales debajo del título
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('Pisos Industriales', rightMargin, presupuestoY + 8, { align: 'right' });

      // Número de presupuesto
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`N° ${numeroPresupuesto}`, rightMargin, presupuestoY + 14, {
        align: 'right',
      });

      // Fecha
      doc.setFont('helvetica', 'normal');
      doc.text(`FECHA: ${formatearFecha(cliente.fecha)}`, rightMargin, presupuestoY + 20, {
        align: 'right',
      });

      // Línea separadora después del encabezado (ajustada para dar más espacio)
      // Calcular la posición más baja entre el contenido de la izquierda (yPos + 32) y la derecha (presupuestoY + 20)
      const maxContentY = Math.max(yPos + 32, presupuestoY + 20);
      const headerBottomY = maxContentY + 6; // Espacio adicional antes de la línea
      yPos = headerBottomY + 10;
      doc.setDrawColor(156, 163, 175);
      doc.setLineWidth(0.5);
      doc.line(leftMargin, headerBottomY, rightMargin, headerBottomY);

      // ========== DATOS DEL CLIENTE ==========
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Datos del Cliente', leftMargin, yPos);
      yPos += 8;
      
      doc.setFontSize(10);
      const lineHeight = 6;
      // Centrar las dos columnas dentro del contenido
      const columnGap = 15; // Espacio entre columnas
      const columnWidth = (contentWidth - columnGap) / 2; // Ancho de cada columna
      const leftColumnX = leftMargin;
      const rightColumnX = leftMargin + columnWidth + columnGap;
      // Calcular el ancho de la etiqueta más larga para posicionar los valores
      doc.setFont('helvetica', 'bold');
      const labelSpacing = 3; // Espacio mínimo entre etiqueta y valor (en mm)
      const leftLabelWidth = Math.max(
        doc.getTextWidth('Razón Social:'),
        doc.getTextWidth('CUIT:'),
        doc.getTextWidth('Domicilio:'),
        doc.getTextWidth('Localidad:'),
        doc.getTextWidth('Provincia:')
      );
      const rightLabelWidth = Math.max(
        doc.getTextWidth('Fecha:'),
        doc.getTextWidth('Condición IVA:'),
        doc.getTextWidth('Teléfono:'),
        doc.getTextWidth('Email:'),
        doc.getTextWidth('Observaciones:')
      );
      const leftValueX = leftColumnX + leftLabelWidth + labelSpacing;
      const rightValueX = rightColumnX + rightLabelWidth + labelSpacing;
      const leftMaxWidth = columnWidth - leftLabelWidth - labelSpacing; // Ancho máximo considerando la etiqueta
      const rightMaxWidth = columnWidth - rightLabelWidth - labelSpacing;

      let leftY = yPos;
      let rightY = yPos;

      // ========== COLUMNA IZQUIERDA ==========
      doc.setFont('helvetica', 'bold');
      doc.text('Razón Social:', leftColumnX, leftY);
      doc.setFont('helvetica', 'normal');
      const razonSocialText = cliente.razonSocial || 'CONSUMIDOR FINAL';
      const razonSocialLines = doc.splitTextToSize(razonSocialText, leftMaxWidth);
      if (Array.isArray(razonSocialLines)) {
        razonSocialLines.forEach((line, idx) => {
          doc.text(line, leftValueX, leftY + idx * lineHeight);
        });
        leftY += razonSocialLines.length * lineHeight;
      } else {
        doc.text(razonSocialLines, leftValueX, leftY);
        leftY += lineHeight;
      }

      doc.setFont('helvetica', 'bold');
      doc.text('CUIT:', leftColumnX, leftY);
      doc.setFont('helvetica', 'normal');
      doc.text(cliente.cuit || '', leftValueX, leftY);
      leftY += lineHeight;

      doc.setFont('helvetica', 'bold');
      doc.text('Domicilio:', leftColumnX, leftY);
      doc.setFont('helvetica', 'normal');
      const domicilioLines = doc.splitTextToSize(cliente.domicilio, leftMaxWidth);
      if (Array.isArray(domicilioLines)) {
        domicilioLines.forEach((line, idx) => {
          doc.text(line, leftValueX, leftY + idx * lineHeight);
        });
        leftY += domicilioLines.length * lineHeight;
      } else {
        doc.text(domicilioLines, leftValueX, leftY);
        leftY += lineHeight;
      }

      doc.setFont('helvetica', 'bold');
      doc.text('Localidad:', leftColumnX, leftY);
      doc.setFont('helvetica', 'normal');
      const localidadLines = doc.splitTextToSize(cliente.localidad || '', leftMaxWidth);
      if (Array.isArray(localidadLines)) {
        localidadLines.forEach((line, idx) => {
          doc.text(line, leftValueX, leftY + idx * lineHeight);
        });
        leftY += localidadLines.length * lineHeight;
      } else {
        doc.text(localidadLines, leftValueX, leftY);
        leftY += lineHeight;
      }

      doc.setFont('helvetica', 'bold');
      doc.text('Provincia:', leftColumnX, leftY);
      doc.setFont('helvetica', 'normal');
      const provinciaLines = doc.splitTextToSize(cliente.provincia, leftMaxWidth);
      if (Array.isArray(provinciaLines)) {
        provinciaLines.forEach((line, idx) => {
          doc.text(line, leftValueX, leftY + idx * lineHeight);
        });
        leftY += provinciaLines.length * lineHeight;
      } else {
        doc.text(provinciaLines, leftValueX, leftY);
        leftY += lineHeight;
      }

      // ========== COLUMNA DERECHA ==========
      doc.setFont('helvetica', 'bold');
      doc.text('Fecha:', rightColumnX, rightY);
      doc.setFont('helvetica', 'normal');
      doc.text(formatearFecha(cliente.fecha), rightValueX, rightY);
      rightY += lineHeight;

      doc.setFont('helvetica', 'bold');
      doc.text('Condición IVA:', rightColumnX, rightY);
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

      doc.setFont('helvetica', 'bold');
      doc.text('Teléfono:', rightColumnX, rightY);
      doc.setFont('helvetica', 'normal');
      doc.text(cliente.telefono, rightValueX, rightY);
      rightY += lineHeight;

      doc.setFont('helvetica', 'bold');
      doc.text('Email:', rightColumnX, rightY);
      doc.setFont('helvetica', 'normal');
      const emailLines = doc.splitTextToSize(cliente.email, rightMaxWidth);
      if (Array.isArray(emailLines)) {
        emailLines.forEach((line, idx) => {
          doc.text(line, rightValueX, rightY + idx * lineHeight);
        });
        rightY += emailLines.length * lineHeight;
      } else {
        doc.text(emailLines, rightValueX, rightY);
        rightY += lineHeight;
      }

      // Observaciones (si existe)
      if (cliente.observaciones && cliente.observaciones.trim()) {
        doc.setFont('helvetica', 'bold');
        doc.text('Observaciones:', rightColumnX, rightY);
        doc.setFont('helvetica', 'normal');
        const obsLines = doc.splitTextToSize(cliente.observaciones, rightMaxWidth);
        if (Array.isArray(obsLines)) {
          obsLines.forEach((line, idx) => {
            doc.text(line, rightValueX, rightY + idx * lineHeight);
          });
          rightY += obsLines.length * lineHeight;
        } else {
          doc.text(obsLines, rightValueX, rightY);
          rightY += lineHeight;
        }
      }

      // Usar el máximo entre las dos columnas para la posición Y final
      let currentY = Math.max(leftY, rightY);

      // Línea separadora después de datos del cliente
      yPos = currentY + 8;
      doc.setDrawColor(156, 163, 175);
      doc.setLineWidth(0.5);
      doc.line(leftMargin, yPos, rightMargin, yPos);
      yPos += 8;

      // ========== DETALLE DEL PRESUPUESTO ==========
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Detalle del Presupuesto', leftMargin, yPos);
      yPos += 8;

      // Formatear datos de la tabla
      const tableData = items.map((item) => {
        const cantidadFormateada = item.cantidad.toFixed(2).replace('.', ',');
        const descripcion = item.descripcion.trim();
        const precioFormateado = formatearMoneda(item.precioUnitario);
        const subtotalFormateado = formatearMoneda(item.subtotal);

        return [
          cantidadFormateada,
          descripcion,
          precioFormateado,
          subtotalFormateado,
        ];
      });

      autoTable(doc, {
        startY: yPos,
        head: [['Cant.', 'Descripción', 'Precio Uni.', 'Subtotal']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [229, 231, 235],
          textColor: [0, 0, 0],
          fontStyle: 'bold' as const,
          fontSize: 10,
          halign: 'center',
        },
        bodyStyles: {
          fontSize: 9,
        },
        columnStyles: {
          0: { 
            cellWidth: 18, 
            halign: 'right',
          },
          1: { 
            cellWidth: 100, 
            halign: 'left',
          },
          2: { 
            cellWidth: 32, 
            halign: 'right',
          },
          3: { 
            cellWidth: 30, 
            halign: 'right',
          },
        },
        styles: {
          lineColor: [156, 163, 175],
          lineWidth: 0.3,
        },
        margin: { left: leftMargin, right: leftMargin },
        alternateRowStyles: {
          fillColor: [249, 250, 251],
        },
        didParseCell: (data) => {
          if (data.column.index === 3 && data.section === 'body') {
            data.cell.styles.fontStyle = 'bold';
          }
        },
      });

      const finalY = (doc as any).lastAutoTable.finalY || yPos + 50;

      // ========== TOTALES Y CONDICIONES (dos columnas) ==========
      let totalY = finalY + 38; // Más espacio antes de la sección
      const totalRightX = rightMargin;

      // Posición de inicio de las etiquetas (usar las mismas columnas que Datos del Cliente)
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      const resumenWidth = columnWidth * (2/3); // 2/3 del ancho de la columna derecha
      const totalLabelX = totalRightX - resumenWidth;

      // ========== COLUMNA IZQUIERDA - Términos y Condiciones ==========
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Términos y Condiciones', leftColumnX, totalY);
      totalY += 8;

      // Dividir las condiciones en líneas
      const condicionesLines = condiciones.split('\n');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      condicionesLines.forEach((line) => {
        if (line.trim()) {
          doc.text(line, leftColumnX, totalY);
          totalY += 6;
        }
      });

      // ========== COLUMNA DERECHA - Resumen Financiero ==========
      totalY = finalY + 38; // Mismo espacio que la columna izquierda

      // Cantidad de Items
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Cantidad de Items:', totalLabelX, totalY);
      doc.setFont('helvetica', 'normal');
      doc.text(cantidadItems.toFixed(2).replace('.', ','), totalRightX, totalY, {
        align: 'right',
      });
      totalY += 7;

      // Subtotal General
      doc.setFont('helvetica', 'bold');
      doc.text('Subtotal General:', totalLabelX, totalY);
      doc.setFont('helvetica', 'normal');
      doc.text(formatearMoneda(subtotalGeneral), totalRightX, totalY, { align: 'right' });
      totalY += 7;

      // Impuestos (IVA)
      doc.setFont('helvetica', 'bold');
      doc.text('Impuestos (IVA):', totalLabelX, totalY);
      doc.setFont('helvetica', 'normal');
      doc.text(formatearMoneda(impuestos), totalRightX, totalY, { align: 'right' });
      totalY += 7;

      // Línea separadora antes del total
      const lineY = totalY + 3;
      doc.setDrawColor(156, 163, 175);
      doc.setLineWidth(0.5);
      doc.line(totalLabelX, lineY, totalRightX, lineY);
      totalY = lineY + 5;

      // TOTAL
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Total:', totalLabelX, totalY);
      doc.text(formatearMoneda(total), totalRightX, totalY, { align: 'right' });

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
