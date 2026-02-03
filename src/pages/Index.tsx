import { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { Dashboard } from '@/components/Dashboard';
import { CSVUpload } from '@/components/CSVUpload';
import { HistoryList } from '@/components/HistoryList';
import { Settings } from '@/components/Settings';
import { DatasetSummary } from '@/types/equipment';
import { motion, AnimatePresence } from 'framer-motion';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { currentData, datasets, setCurrentData } = useApp();

  // Load most recent dataset on mount if available
  useEffect(() => {
    if (datasets.length > 0 && currentData.length === 0) {
      setCurrentData(datasets[0].data);
    }
  }, [datasets, currentData, setCurrentData]);

  const handleSelectDataset = (dataset: DatasetSummary) => {
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard data={currentData} />;
      case 'upload':
        return <CSVUpload />;
      case 'history':
        return <HistoryList onSelectDataset={handleSelectDataset} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard data={currentData} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}

    </div>
  );
}

const Index = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default Index;
