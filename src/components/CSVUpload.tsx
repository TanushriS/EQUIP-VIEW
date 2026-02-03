import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';

// ... (other imports)

export function CSVUpload() {
  const { t, addDataset } = useApp();
  // ... (state)

  const handleUpload = useCallback(async (file: File) => {
    setIsProcessing(true);
    setUploadStatus('idle');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        try {
            if (results.errors.length > 0) {
                throw new Error(results.errors[0].message);
            }

            const rawData = results.data as any[];
            
            // Validate and map data
            const equipmentData = rawData.map((row, index) => {
                if (!row['Equipment Name'] || !row['Type']) {
                    throw new Error(`Row ${index + 1}: Missing required fields`);
                }
                return {
                    id: uuidv4(),
                    equipmentName: row['Equipment Name'],
                    type: row['Type'],
                    flowrate: Number(row['Flowrate'] || 0),
                    pressure: Number(row['Pressure'] || 0),
                    temperature: Number(row['Temperature'] || 0)
                };
            });

            // Calculate stats
            const totalCount = equipmentData.length;
            const avgFlowrate = equipmentData.reduce((acc, curr) => acc + curr.flowrate, 0) / totalCount;
            const avgPressure = equipmentData.reduce((acc, curr) => acc + curr.pressure, 0) / totalCount;
            const avgTemperature = equipmentData.reduce((acc, curr) => acc + curr.temperature, 0) / totalCount;
            
            const typeDistribution = equipmentData.reduce((acc, curr) => {
                acc[curr.type] = (acc[curr.type] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const dataset = {
                id: uuidv4(),
                uploadedAt: new Date(),
                fileName: file.name,
                totalCount,
                avgFlowrate,
                avgPressure,
                avgTemperature,
                typeDistribution,
                data: equipmentData
            };

            addDataset(dataset);
            setUploadStatus('success');
            toast.success(t('upload.success'));
        } catch (error: any) {
            console.error('Error parsing CSV:', error);
            setUploadStatus('error');
            toast.error(error.message || 'Error parsing CSV file');
        } finally {
            setIsProcessing(false);
        }
      },
      error: (error) => {
        console.error('Error reading CSV:', error);
        setUploadStatus('error');
        toast.error('Error reading CSV file');
        setIsProcessing(false);
      }
    });
  }, [addDataset, t]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type === 'text/csv') {
        handleUpload(file);
      } else {
        toast.error('Please upload a CSV file');
      }
    },
    [handleUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleUpload(file);
      }
    },
    [handleUpload]
  );

  const loadSampleData = () => {
    // For sample data, we might still want to upload it to backend to simulate real flow,
    // or just leave it client-side for "demo". Given requirement strictly says "Both frontends must support CSV uploads to the backend",
    // we should really upload it. But constructing a File object from data is tricky.
    // For now, let's keep client-side load for "Sample" or maybe disable it if we want strict compliance.
    // Let's keep it but warn it's local only? No, let's just create a File and upload it.

    // Creating a CSV blob
    const headers = ["Equipment Name", "Type", "Flowrate", "Pressure", "Temperature"];
    const rows = sampleEquipmentData.map(d =>
      [d.equipmentName, d.type, d.flowrate, d.pressure, d.temperature].join(",")
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const file = new File([blob], "sample_equipment_data.csv", { type: 'text/csv' });

    handleUpload(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-display font-bold text-foreground">
          {t('upload.title')}
        </h2>
        <p className="text-muted-foreground">
          Upload your equipment data in CSV format with columns: Equipment Name, Type, Flowrate, Pressure, Temperature
        </p>
      </div>

      {/* Upload Zone */}
      <div
        className={`upload-zone cursor-pointer ${isDragging ? 'dragging' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          {isProcessing ? (
            <>
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-sage to-teal flex items-center justify-center animate-pulse">
                <FileSpreadsheet className="h-8 w-8 text-primary-foreground" />
              </div>
              <p className="text-lg font-medium text-foreground">{t('upload.processing')}</p>
            </>
          ) : uploadStatus === 'success' ? (
            <>
              <div className="h-16 w-16 rounded-full bg-sage flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-primary-foreground" />
              </div>
              <p className="text-lg font-medium text-foreground">{t('upload.success')}</p>
            </>
          ) : uploadStatus === 'error' ? (
            <>
              <div className="h-16 w-16 rounded-full bg-destructive flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-destructive-foreground" />
              </div>
              <p className="text-lg font-medium text-destructive">Error processing file</p>
            </>
          ) : (
            <>
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-sage/50 to-teal/50 flex items-center justify-center">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-medium text-foreground">{t('upload.dropzone')}</p>
                <p className="text-sm text-muted-foreground">Supports CSV files</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap justify-center gap-3">
        <Button
          variant="outline"
          onClick={downloadSampleCSV}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Download Sample CSV
        </Button>
        <Button
          variant="secondary"
          onClick={loadSampleData}
          className="gap-2"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Load Sample Data
        </Button>
      </div>

      {/* Format Info */}
      <div className="bg-muted/50 rounded-xl p-4">
        <h3 className="font-semibold text-foreground mb-2">Expected CSV Format:</h3>
        <code className="text-sm text-muted-foreground block overflow-x-auto whitespace-nowrap">
          Equipment Name, Type, Flowrate, Pressure, Temperature<br />
          Centrifugal Pump A1, Pump, 150.5, 8.2, 45.0<br />
          Heat Exchanger HE-101, Heat Exchanger, 280.0, 12.5, 120.0
        </code>
      </div>
    </motion.div>
  );
}
