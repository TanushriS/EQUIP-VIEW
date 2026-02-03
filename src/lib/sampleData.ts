import { Equipment } from '@/types/equipment';

export const sampleEquipmentData: Equipment[] = [
  { id: '1', equipmentName: 'Centrifugal Pump A1', type: 'Pump', flowrate: 150.5, pressure: 8.2, temperature: 45.0 },
  { id: '2', equipmentName: 'Heat Exchanger HE-101', type: 'Heat Exchanger', flowrate: 280.0, pressure: 12.5, temperature: 120.0 },
  { id: '3', equipmentName: 'Reactor Vessel RV-01', type: 'Reactor', flowrate: 75.2, pressure: 25.0, temperature: 180.5 },
  { id: '4', equipmentName: 'Distillation Column DC-1', type: 'Column', flowrate: 450.0, pressure: 5.5, temperature: 105.0 },
  { id: '5', equipmentName: 'Compressor CP-201', type: 'Compressor', flowrate: 520.8, pressure: 35.0, temperature: 65.0 },
  { id: '6', equipmentName: 'Storage Tank ST-A1', type: 'Tank', flowrate: 0.0, pressure: 1.0, temperature: 25.0 },
  { id: '7', equipmentName: 'Centrifugal Pump B2', type: 'Pump', flowrate: 185.3, pressure: 9.8, temperature: 42.0 },
  { id: '8', equipmentName: 'Shell & Tube HE-102', type: 'Heat Exchanger', flowrate: 310.5, pressure: 15.0, temperature: 135.0 },
  { id: '9', equipmentName: 'CSTR Reactor RV-02', type: 'Reactor', flowrate: 95.0, pressure: 30.0, temperature: 200.0 },
  { id: '10', equipmentName: 'Absorption Column AC-1', type: 'Column', flowrate: 380.0, pressure: 4.2, temperature: 85.0 },
  { id: '11', equipmentName: 'Reciprocating Pump RP-01', type: 'Pump', flowrate: 120.0, pressure: 15.5, temperature: 38.0 },
  { id: '12', equipmentName: 'Plate Heat Exchanger PHE-01', type: 'Heat Exchanger', flowrate: 220.0, pressure: 10.0, temperature: 95.0 },
  { id: '13', equipmentName: 'Batch Reactor BR-01', type: 'Reactor', flowrate: 50.0, pressure: 20.0, temperature: 150.0 },
  { id: '14', equipmentName: 'Fractionation Column FC-1', type: 'Column', flowrate: 550.0, pressure: 6.8, temperature: 115.0 },
  { id: '15', equipmentName: 'Screw Compressor SC-01', type: 'Compressor', flowrate: 480.0, pressure: 28.0, temperature: 72.0 },
  { id: '16', equipmentName: 'Process Tank PT-B2', type: 'Tank', flowrate: 10.5, pressure: 1.5, temperature: 30.0 },
  { id: '17', equipmentName: 'Booster Pump BP-03', type: 'Pump', flowrate: 200.0, pressure: 12.0, temperature: 50.0 },
  { id: '18', equipmentName: 'Air Cooled HE-103', type: 'Heat Exchanger', flowrate: 180.0, pressure: 8.0, temperature: 80.0 },
  { id: '19', equipmentName: 'PFR Reactor PFR-01', type: 'Reactor', flowrate: 110.0, pressure: 35.0, temperature: 220.0 },
  { id: '20', equipmentName: 'Stripping Column SC-2', type: 'Column', flowrate: 420.0, pressure: 5.0, temperature: 100.0 },
];

export function generateCSVContent(data: Equipment[]): string {
  const headers = ['Equipment Name', 'Type', 'Flowrate', 'Pressure', 'Temperature'];
  const rows = data.map((item) => [
    item.equipmentName,
    item.type,
    item.flowrate.toString(),
    item.pressure.toString(),
    item.temperature.toString(),
  ]);
  
  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

export function downloadSampleCSV(): void {
  const csvContent = generateCSVContent(sampleEquipmentData);
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sample_equipment_data.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
