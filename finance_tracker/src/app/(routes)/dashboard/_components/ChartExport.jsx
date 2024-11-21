import React, { useRef } from 'react';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FileDown } from 'lucide-react';

export const useChartExport = () => {
  const exportChartToPDF = async (chartRef, chartName = 'Chart') => {
    if (!chartRef.current) {
      console.error('Chart reference is not available');
      return;
    }

    try {
      // Temporarily adjust container for full capture
      const originalOverflow = chartRef.current.style.overflow;
      const originalWidth = chartRef.current.style.width;
      
      // Ensure full chart is visible
      chartRef.current.style.overflow = 'visible';
      chartRef.current.style.width = 'auto';

      // Capture the entire chart content
      const canvas = await html2canvas(chartRef.current, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        logging: false,
        allowTaint: true,
        scrollX: 0,
        scrollY: -window.scrollY
      });

      // Restore original styles
      chartRef.current.style.overflow = originalOverflow;
      chartRef.current.style.width = originalWidth;

      // Create PDF with dynamic sizing
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: 'a4'
      });

      // Get PDF page dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate scaling to fit chart
      const widthRatio = pageWidth / canvas.width;
      const heightRatio = pageHeight / canvas.height;
      const scale = Math.min(widthRatio, heightRatio) * 0.9; // 90% of page size

      const scaledWidth = canvas.width * scale;
      const scaledHeight = canvas.height * scale;

      // Center the image
      const xPadding = (pageWidth - scaledWidth) / 2;
      const yPadding = (pageHeight - scaledHeight) / 2;

      // Add image to PDF
      pdf.addImage(
        canvas.toDataURL('image/png'), 
        'PNG', 
        xPadding, 
        yPadding, 
        scaledWidth, 
        scaledHeight
      );

      // Save PDF
      pdf.save(`${chartName}_Export_${new Date().toISOString().split('T')[0]}.pdf`);

    } catch (error) {
      console.error('PDF export failed:', error);
    }
  };

  return { exportChartToPDF };
};

// Rest of the components remain the same
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
        px-3 py-1.5 md:px-4 md:py-2 rounded-lg 
        hover:bg-blue-600 
        transition-all duration-300 
        transform hover:scale-105 active:scale-95
        text-xs md:text-sm
        ${className}
      `}
    >
      <FileDown className="w-4 h-4 md:w-5 md:h-5" />
      <span className="hidden md:inline">Export PDF</span>
      <span className="md:hidden">PDF</span>
    </button>
  );
};

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


