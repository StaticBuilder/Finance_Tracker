import React, { useRef } from 'react';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FileDown } from 'lucide-react';

// Utility function for chart export
// Utility function for chart export
export const useChartExport = () => {
  // Export chart to PDF
  const exportChartToPDF = async (chartRef, chartName = 'Chart') => {
    // Check if the chart reference exists
    if (!chartRef.current) {
      console.error('Chart reference is not available');
      return;
    }

    try {
      // Use html2canvas to capture the chart
      const canvas = await html2canvas(chartRef.current, {
        scale: 2, // Increases resolution
        useCORS: true, // Handles cross-origin images
        logging: false // Disables logging
      });

      // Create PDF
      const pdf = new jsPDF('landscape', 'px', 'a4');
      
      // Calculate dimensions to fit the page
      const imgWidth = pdf.internal.pageSize.getWidth() - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add image to PDF
      pdf.addImage(
        canvas.toDataURL('image/png'), 
        'PNG', 
        20, // Left margin
        20, // Top margin
        imgWidth, 
        imgHeight
      );

      // Save PDF
      pdf.save(`${chartName}_Export_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
    }
  };

  return { exportChartToPDF };
};

// Export Button Component
export const ChartExportButton = ({ 
  chartRef, 
  chartName, 
  className = '' 
}) => {
  const { exportChartToPDF } = useChartExport();

  return (
    <button
      onClick={() => exportChartToPDF(chartRef, chartName)}
      className={`
        flex items-center gap-2 
        bg-blue-500 text-white 
        px-4 py-2 rounded-lg 
        hover:bg-blue-600 
        transition-colors 
        ${className}
      `}
    >
      <FileDown className="w-5 h-5" />
      Export PDF
    </button>
  );
};

// Enhanced Chart Wrapper Component
export const ChartWrapper = ({ 
  children, 
  title, 
  exportable = true 
}) => {
  const chartRef = useRef(null);
  const { exportChartToPDF } = useChartExport();

  return (
    <div className="relative">
      {exportable && (
        <div className="absolute top-2 right-2 z-10">
          <ChartExportButton 
            chartRef={chartRef} 
            chartName={title}
          />
        </div>
      )}
      <div ref={chartRef}>
        {children}
      </div>
    </div>
  );
};