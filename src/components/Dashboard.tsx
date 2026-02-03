import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Equipment } from '@/types/equipment';
import { StatsCard } from '@/components/StatsCard';
import { Charts } from '@/components/Charts';
import { DataTable } from '@/components/DataTable';
import { PDFReport } from '@/components/PDFReport';
import { motion } from 'framer-motion';
import { Activity, Gauge, Thermometer, Box, TrendingUp } from 'lucide-react';

interface DashboardProps {
  data: Equipment[];
}

export function Dashboard({ data }: DashboardProps) {
  const { t } = useApp();

  const stats = useMemo(() => {
    if (data.length === 0) {
      return {
        totalEquipment: 0,
        avgFlowrate: 0,
        avgPressure: 0,
        avgTemperature: 0,
        typeCount: 0,
      };
    }

    const types = new Set(data.map((item) => item.type));
    const totalFlowrate = data.reduce((sum, item) => sum + item.flowrate, 0);
    const totalPressure = data.reduce((sum, item) => sum + item.pressure, 0);
    const totalTemperature = data.reduce((sum, item) => sum + item.temperature, 0);

    return {
      totalEquipment: data.length,
      avgFlowrate: totalFlowrate / data.length,
      avgPressure: totalPressure / data.length,
      avgTemperature: totalTemperature / data.length,
      typeCount: types.size,
    };
  }, [data]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            {t('dashboard.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <PDFReport data={data} />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title={t('stats.totalEquipment')}
          value={stats.totalEquipment}
          subtitle={`${stats.typeCount} different types`}
          icon={Box}
          delay={0}
        />
        <StatsCard
          title={t('stats.avgFlowrate')}
          value={`${stats.avgFlowrate.toFixed(2)}`}
          subtitle="L/min"
          icon={Activity}
          delay={0.1}
        />
        <StatsCard
          title={t('stats.avgPressure')}
          value={`${stats.avgPressure.toFixed(2)}`}
          subtitle="bar"
          icon={Gauge}
          delay={0.2}
        />
        <StatsCard
          title={t('stats.avgTemperature')}
          value={`${stats.avgTemperature.toFixed(2)}`}
          subtitle="°C"
          icon={Thermometer}
          delay={0.3}
        />
      </div>

      {data.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-card rounded-xl border border-border"
        >
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Data Available</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Upload a CSV file or load sample data to see your equipment analytics and visualizations.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Charts */}
          <section>
            <h2 className="text-xl font-display font-semibold text-foreground mb-4">
              Data Visualization
            </h2>
            <Charts data={data} />
          </section>

          {/* Data Table */}
          <section>
            <h2 className="text-xl font-display font-semibold text-foreground mb-4">
              Equipment Data
            </h2>
            <div className="bg-card rounded-xl border border-border p-6">
              <DataTable data={data} />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
