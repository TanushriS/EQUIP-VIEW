import { useApp } from '@/context/AppContext';
import { Equipment, AnalyticsSummary } from '@/types/equipment';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { toast } from 'sonner';

interface PDFReportProps {
  data: Equipment[];
}

export function PDFReport({ data }: PDFReportProps) {
  const { t } = useApp();

  const generatePDF = () => {
    if (data.length === 0) {
      toast.error('No data available to generate report');
      return;
    }

    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(93, 143, 153);
    doc.text('Chemical Equipment Parameter Report', 14, 20);
    
    // Generated date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

    // Summary Statistics
    const summary = calculateSummary(data);
    
    doc.setFontSize(14);
    doc.setTextColor(30, 50, 40);
    doc.text('Summary Statistics', 14, 40);
    
    doc.setFontSize(10);
    doc.setTextColor(60);
    
    const summaryData = [
      ['Total Equipment', summary.totalEquipment.toString()],
      ['Average Flowrate', `${summary.avgFlowrate.toFixed(2)} L/min`],
      ['Average Pressure', `${summary.avgPressure.toFixed(2)} bar`],
      ['Average Temperature', `${summary.avgTemperature.toFixed(2)} °C`],
      ['Flowrate Range', `${summary.minFlowrate.toFixed(2)} - ${summary.maxFlowrate.toFixed(2)} L/min`],
      ['Pressure Range', `${summary.minPressure.toFixed(2)} - ${summary.maxPressure.toFixed(2)} bar`],
      ['Temperature Range', `${summary.minTemperature.toFixed(2)} - ${summary.maxTemperature.toFixed(2)} °C`],
    ];

    autoTable(doc, {
      startY: 45,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'striped',
      headStyles: { fillColor: [147, 191, 199] },
      styles: { fontSize: 9 },
    });

    // Type Distribution
    const typeDistY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setTextColor(30, 50, 40);
    doc.text('Equipment Type Distribution', 14, typeDistY);

    const typeData = Object.entries(summary.typeDistribution).map(([type, count]) => [
      type,
      count.toString(),
      `${((count / summary.totalEquipment) * 100).toFixed(1)}%`,
    ]);

    autoTable(doc, {
      startY: typeDistY + 5,
      head: [['Type', 'Count', 'Percentage']],
      body: typeData,
      theme: 'striped',
      headStyles: { fillColor: [171, 231, 185] },
      styles: { fontSize: 9 },
    });

    // Equipment Data Table
    const dataTableY = (doc as any).lastAutoTable.finalY + 15;
    
    // Check if we need a new page
    if (dataTableY > 240) {
      doc.addPage();
      doc.setFontSize(14);
      doc.setTextColor(30, 50, 40);
      doc.text('Equipment Data', 14, 20);
      
      autoTable(doc, {
        startY: 25,
        head: [['Equipment Name', 'Type', 'Flowrate (L/min)', 'Pressure (bar)', 'Temp (°C)']],
        body: data.map((item) => [
          item.equipmentName,
          item.type,
          item.flowrate.toFixed(2),
          item.pressure.toFixed(2),
          item.temperature.toFixed(2),
        ]),
        theme: 'striped',
        headStyles: { fillColor: [147, 191, 199] },
        styles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 35 },
        },
      });
    } else {
      doc.setFontSize(14);
      doc.setTextColor(30, 50, 40);
      doc.text('Equipment Data', 14, dataTableY);

      autoTable(doc, {
        startY: dataTableY + 5,
        head: [['Equipment Name', 'Type', 'Flowrate (L/min)', 'Pressure (bar)', 'Temp (°C)']],
        body: data.map((item) => [
          item.equipmentName,
          item.type,
          item.flowrate.toFixed(2),
          item.pressure.toFixed(2),
          item.temperature.toFixed(2),
        ]),
        theme: 'striped',
        headStyles: { fillColor: [147, 191, 199] },
        styles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 35 },
        },
      });
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Chemical Equipment Parameter Visualizer - Page ${i} of ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    // Save
    doc.save(`equipment_report_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF report downloaded successfully!');
  };

  return (
    <Button onClick={generatePDF} className="gap-2" disabled={data.length === 0}>
      <FileDown className="h-4 w-4" />
      {t('action.downloadPdf')}
    </Button>
  );
}

function calculateSummary(data: Equipment[]): AnalyticsSummary {
  const types: Record<string, number> = {};
  let totalFlowrate = 0;
  let totalPressure = 0;
  let totalTemperature = 0;
  let minFlowrate = Infinity;
  let maxFlowrate = -Infinity;
  let minPressure = Infinity;
  let maxPressure = -Infinity;
  let minTemperature = Infinity;
  let maxTemperature = -Infinity;

  data.forEach((item) => {
    types[item.type] = (types[item.type] || 0) + 1;
    totalFlowrate += item.flowrate;
    totalPressure += item.pressure;
    totalTemperature += item.temperature;
    minFlowrate = Math.min(minFlowrate, item.flowrate);
    maxFlowrate = Math.max(maxFlowrate, item.flowrate);
    minPressure = Math.min(minPressure, item.pressure);
    maxPressure = Math.max(maxPressure, item.pressure);
    minTemperature = Math.min(minTemperature, item.temperature);
    maxTemperature = Math.max(maxTemperature, item.temperature);
  });

  return {
    totalEquipment: data.length,
    avgFlowrate: data.length > 0 ? totalFlowrate / data.length : 0,
    avgPressure: data.length > 0 ? totalPressure / data.length : 0,
    avgTemperature: data.length > 0 ? totalTemperature / data.length : 0,
    minFlowrate: minFlowrate === Infinity ? 0 : minFlowrate,
    maxFlowrate: maxFlowrate === -Infinity ? 0 : maxFlowrate,
    minPressure: minPressure === Infinity ? 0 : minPressure,
    maxPressure: maxPressure === -Infinity ? 0 : maxPressure,
    minTemperature: minTemperature === Infinity ? 0 : minTemperature,
    maxTemperature: maxTemperature === -Infinity ? 0 : maxTemperature,
    typeDistribution: types,
  };
}
