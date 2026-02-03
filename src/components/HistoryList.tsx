import { useApp } from '@/context/AppContext';
import { DatasetSummary } from '@/types/equipment';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FileSpreadsheet, Trash2, Eye, Clock } from 'lucide-react';

interface HistoryListProps {
  onSelectDataset: (data: DatasetSummary) => void;
}

export function HistoryList({ onSelectDataset }: HistoryListProps) {
  const { t, datasets, deleteDataset, setCurrentData } = useApp();

  if (datasets.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Clock className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{t('history.noData')}</h3>
        <p className="text-muted-foreground">Upload a CSV file to see your history here.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-display font-bold text-foreground mb-6">
        {t('history.title')}
      </h2>

      <p className="text-sm text-muted-foreground mb-4">
        Showing last {datasets.length} uploaded datasets (max 5)
      </p>

      <div className="space-y-3">
        {datasets.map((dataset, index) => (
          <motion.div
            key={dataset.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sage/50 to-teal/50 flex items-center justify-center flex-shrink-0">
                  <FileSpreadsheet className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">{dataset.fileName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(dataset.uploadedAt), 'PPp')}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground">
                      {dataset.totalCount} items
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-teal/20 text-xs text-foreground">
                      Avg Flow: {dataset.avgFlowrate.toFixed(1)} L/min
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-sage/20 text-xs text-foreground">
                      Avg Pressure: {dataset.avgPressure.toFixed(1)} bar
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-mint/20 text-xs text-foreground">
                      Avg Temp: {dataset.avgTemperature.toFixed(1)}°C
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentData(dataset.data);
                    onSelectDataset(dataset);
                  }}
                  className="gap-1.5"
                >
                  <Eye className="h-4 w-4" />
                  {t('action.viewDetails')}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteDataset(dataset.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
