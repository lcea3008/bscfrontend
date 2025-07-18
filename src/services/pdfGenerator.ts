// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import { kpidata, type KPIData } from './kpidata';
// import { usersService, type User } from './usersService';
// import { perspectivasService, type Perspectiva } from './perspectivasService';

// export const generateDashboardPDF = async () => {
//   try {
//     // Crear nuevo documento PDF
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const pageHeight = pdf.internal.pageSize.getHeight();
    
//     // Título del reporte
//     pdf.setFontSize(20);
//     pdf.setTextColor(220, 38, 38); // Color rojo
//     pdf.text('Reporte BSC Dashboard', pageWidth / 2, 20, { align: 'center' });
    
//     // Fecha del reporte
//     pdf.setFontSize(12);
//     pdf.setTextColor(100, 100, 100);
//     pdf.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, pageWidth / 2, 30, { align: 'center' });
    
//     let yPosition = 50;
    
//     // Obtener datos del sistema
//     const [kpis, users, perspectivas] = await Promise.all([
//       kpidata.getKpis(),
//       usersService.getUsers(),
//       perspectivasService.getPerspectivas()
//     ]);

//     // Calcular estadísticas
//     const objetivosUnicos = new Set(kpis.map((kpi: KPIData) => kpi.objetivo_id));
    
//     // Sección de estadísticas generales
//     pdf.setFontSize(16);
//     pdf.setTextColor(0, 0, 0);
//     pdf.text('Resumen Ejecutivo', 20, yPosition);
//     yPosition += 15;
    
//     pdf.setFontSize(12);
//     const stats = [
//       `Total de KPIs: ${kpis.length}`,
//       `Total de Perspectivas: ${perspectivas.length}`,
//       `Total de Objetivos: ${objetivosUnicos.size}`,
//       `Total de Usuarios: ${users.length}`
//     ];
    
//     stats.forEach(stat => {
//       pdf.text(`• ${stat}`, 25, yPosition);
//       yPosition += 8;
//     });
    
//     yPosition += 10;
    
//     // Sección de perspectivas
//     pdf.setFontSize(16);
//     pdf.text('Distribución por Perspectivas', 20, yPosition);
//     yPosition += 15;
    
//     // Agrupar KPIs por perspectiva - necesitamos obtener perspectiva a través del objetivo
//     const kpisPorPerspectiva: Record<string, KPIData[]> = {};
//     kpis.forEach((kpi: KPIData) => {
//       // Para simplificar, vamos a agrupar por objetivo_id primero
//       const nombrePerspectiva = `Objetivo ${kpi.objetivo_id}`;
      
//       if (!kpisPorPerspectiva[nombrePerspectiva]) {
//         kpisPorPerspectiva[nombrePerspectiva] = [];
//       }
//       kpisPorPerspectiva[nombrePerspectiva].push(kpi);
//     });
    
//     // Mostrar distribución
//     pdf.setFontSize(12);
//     Object.entries(kpisPorPerspectiva).forEach(([perspectiva, kpisArray]) => {
//       pdf.text(`${perspectiva}: ${(kpisArray as any[]).length} KPIs`, 25, yPosition);
//       yPosition += 8;
//     });
    
//     yPosition += 15;
    
//     // Intentar capturar gráficos del dashboard si estamos en la página correcta
//     const dashboardElement = document.querySelector('[data-dashboard]');
//     if (dashboardElement) {
//       try {
//         const canvas = await html2canvas(dashboardElement as HTMLElement, {
//           scale: 2,
//           logging: false,
//           useCORS: true
//         });
        
//         const imgData = canvas.toDataURL('image/png');
//         const imgWidth = pageWidth - 40;
//         const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
//         // Verificar si necesitamos una nueva página
//         if (yPosition + imgHeight > pageHeight - 20) {
//           pdf.addPage();
//           yPosition = 20;
//         }
        
//         pdf.setFontSize(16);
//         pdf.text('Gráficos del Dashboard', 20, yPosition);
//         yPosition += 15;
        
//         pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
//         yPosition += imgHeight + 10;
//       } catch (error) {
//         console.warn('No se pudieron capturar los gráficos:', error);
//       }
//     }
    
//     // Lista detallada de KPIs
//     if (yPosition > pageHeight - 60) {
//       pdf.addPage();
//       yPosition = 20;
//     }
    
//     pdf.setFontSize(16);
//     pdf.text('Lista de KPIs', 20, yPosition);
//     yPosition += 15;
    
//     pdf.setFontSize(10);
//     kpis.slice(0, 15).forEach((kpi: KPIData, index: number) => { // Limitar a 15 KPIs para evitar overflow
//       if (yPosition > pageHeight - 20) {
//         pdf.addPage();
//         yPosition = 20;
//       }
      
//       pdf.text(`${index + 1}. ${kpi.nombre} - Objetivo ${kpi.objetivo_id}`, 25, yPosition);
//       yPosition += 6;
//     });
    
//     // Pie de página
//     const totalPages = pdf.getNumberOfPages();
//     for (let i = 1; i <= totalPages; i++) {
//       pdf.setPage(i);
//       pdf.setFontSize(8);
//       pdf.setTextColor(150, 150, 150);
//       pdf.text(
//         `Página ${i} de ${totalPages} - BSC Dashboard Report`,
//         pageWidth / 2,
//         pageHeight - 10,
//         { align: 'center' }
//       );
//     }
    
//     // Descargar el PDF
//     const fileName = `BSC_Dashboard_Report_${new Date().toISOString().split('T')[0]}.pdf`;
//     pdf.save(fileName);
    
//     return { success: true, fileName };
    
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     throw new Error('Error al generar el reporte PDF');
//   }
// };

// // Función auxiliar para capturar un elemento específico como imagen
// export const captureElementAsPNG = async (element: HTMLElement): Promise<string> => {
//   const canvas = await html2canvas(element, {
//     scale: 2,
//     logging: false,
//     useCORS: true,
//     backgroundColor: '#ffffff'
//   });
  
//   return canvas.toDataURL('image/png');
// };
