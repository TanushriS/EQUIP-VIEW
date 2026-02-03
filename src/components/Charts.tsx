import { useMemo } from 'react';
import { Equipment } from '@/types/equipment';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  RadialLinearScale,
} from 'chart.js';
import { Bar, Pie, Line, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  RadialLinearScale
);

interface ChartsProps {
  data: Equipment[];
}

export function Charts({ data }: ChartsProps) {
  const { t, theme } = useApp();

  const chartColors = useMemo(() => ({
    cream: theme === 'dark' ? 'rgba(100, 140, 130, 0.8)' : 'rgba(236, 244, 232, 0.8)',
    mint: theme === 'dark' ? 'rgba(100, 180, 120, 0.8)' : 'rgba(203, 243, 187, 0.8)',
    sage: theme === 'dark' ? 'rgba(120, 200, 140, 0.8)' : 'rgba(171, 231, 185, 0.8)',
    teal: theme === 'dark' ? 'rgba(100, 170, 180, 0.8)' : 'rgba(147, 191, 199, 0.8)',
    primary: theme === 'dark' ? 'rgba(100, 180, 190, 1)' : 'rgba(93, 143, 153, 1)',
    secondary: theme === 'dark' ? 'rgba(120, 200, 140, 1)' : 'rgba(131, 191, 145, 1)',
    text: theme === 'dark' ? 'rgba(240, 245, 238, 0.9)' : 'rgba(30, 50, 40, 0.9)',
    grid: theme === 'dark' ? 'rgba(100, 140, 130, 0.2)' : 'rgba(171, 231, 185, 0.3)',
  }), [theme]);

  const typeDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      counts[item.type] = (counts[item.type] || 0) + 1;
    });
    return counts;
  }, [data]);

  const typeChartData = useMemo(() => ({
    labels: Object.keys(typeDistribution),
    datasets: [
      {
        data: Object.values(typeDistribution),
        backgroundColor: [
          chartColors.teal,
          chartColors.sage,
          chartColors.mint,
          chartColors.cream,
          'rgba(180, 220, 200, 0.8)',
          'rgba(160, 200, 210, 0.8)',
        ],
        borderColor: theme === 'dark' ? 'rgba(40, 60, 50, 1)' : 'rgba(255, 255, 255, 1)',
        borderWidth: 2,
      },
    ],
  }), [typeDistribution, chartColors, theme]);

  const parameterBarData = useMemo(() => ({
    labels: data.slice(0, 10).map((item) => item.equipmentName.split(' ').slice(0, 2).join(' ')),
    datasets: [
      {
        label: 'Flowrate (L/min)',
        data: data.slice(0, 10).map((item) => item.flowrate),
        backgroundColor: chartColors.teal,
        borderRadius: 6,
      },
      {
        label: 'Pressure (bar)',
        data: data.slice(0, 10).map((item) => item.pressure),
        backgroundColor: chartColors.sage,
        borderRadius: 6,
      },
      {
        label: 'Temperature (°C)',
        data: data.slice(0, 10).map((item) => item.temperature),
        backgroundColor: chartColors.mint,
        borderRadius: 6,
      },
    ],
  }), [data, chartColors]);

  const flowrateTrendData = useMemo(() => ({
    labels: data.map((_, index) => `#${index + 1}`),
    datasets: [
      {
        label: 'Flowrate',
        data: data.map((item) => item.flowrate),
        fill: true,
        backgroundColor: `${chartColors.teal.replace('0.8', '0.2')}`,
        borderColor: chartColors.primary,
        tension: 0.4,
        pointBackgroundColor: chartColors.primary,
        pointBorderColor: theme === 'dark' ? '#1a2a20' : '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  }), [data, chartColors, theme]);

  const radarData = useMemo(() => {
    const avgByType: Record<string, { flowrate: number; pressure: number; temperature: number; count: number }> = {};
    
    data.forEach((item) => {
      if (!avgByType[item.type]) {
        avgByType[item.type] = { flowrate: 0, pressure: 0, temperature: 0, count: 0 };
      }
      avgByType[item.type].flowrate += item.flowrate;
      avgByType[item.type].pressure += item.pressure;
      avgByType[item.type].temperature += item.temperature;
      avgByType[item.type].count += 1;
    });

    const types = Object.keys(avgByType);
    const normalizedData = types.map((type) => ({
      type,
      flowrate: avgByType[type].flowrate / avgByType[type].count / 10,
      pressure: avgByType[type].pressure / avgByType[type].count,
      temperature: avgByType[type].temperature / avgByType[type].count / 5,
    }));

    return {
      labels: types,
      datasets: [
        {
          label: 'Flowrate (normalized)',
          data: normalizedData.map((d) => d.flowrate),
          backgroundColor: `${chartColors.teal.replace('0.8', '0.3')}`,
          borderColor: chartColors.primary,
          borderWidth: 2,
        },
        {
          label: 'Pressure',
          data: normalizedData.map((d) => d.pressure),
          backgroundColor: `${chartColors.sage.replace('0.8', '0.3')}`,
          borderColor: chartColors.secondary,
          borderWidth: 2,
        },
      ],
    };
  }, [data, chartColors]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: chartColors.text,
          font: { family: 'Inter', size: 12 },
        },
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? 'rgba(20, 40, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: theme === 'dark' ? '#f0f5ee' : '#1e3228',
        bodyColor: theme === 'dark' ? '#d0ddd5' : '#3a5a48',
        borderColor: chartColors.grid,
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: {
      x: {
        ticks: { color: chartColors.text },
        grid: { color: chartColors.grid },
      },
      y: {
        ticks: { color: chartColors.text },
        grid: { color: chartColors.grid },
      },
    },
  }), [chartColors, theme]);

  const pieOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: chartColors.text,
          font: { family: 'Inter', size: 12 },
          padding: 16,
        },
      },
    },
  }), [chartColors]);

  const radarOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: chartColors.text,
          font: { family: 'Inter', size: 12 },
        },
      },
    },
    scales: {
      r: {
        ticks: { color: chartColors.text, backdropColor: 'transparent' },
        grid: { color: chartColors.grid },
        angleLines: { color: chartColors.grid },
        pointLabels: { color: chartColors.text, font: { size: 11 } },
      },
    },
  }), [chartColors]);

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No data available for visualization. Please upload a CSV file.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Equipment Type Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="chart-container"
      >
        <h3 className="font-display font-semibold text-lg text-foreground mb-4">
          {t('charts.typeDistribution')}
        </h3>
        <div className="h-64">
          <Pie data={typeChartData} options={pieOptions} />
        </div>
      </motion.div>

      {/* Parameter Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="chart-container"
      >
        <h3 className="font-display font-semibold text-lg text-foreground mb-4">
          {t('charts.parameterComparison')}
        </h3>
        <div className="h-64">
          <Bar data={parameterBarData} options={chartOptions} />
        </div>
      </motion.div>

      {/* Flowrate Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="chart-container"
      >
        <h3 className="font-display font-semibold text-lg text-foreground mb-4">
          {t('charts.flowrateDistribution')}
        </h3>
        <div className="h-64">
          <Line data={flowrateTrendData} options={chartOptions} />
        </div>
      </motion.div>

      {/* Radar Chart - Parameter Comparison by Type */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="chart-container"
      >
        <h3 className="font-display font-semibold text-lg text-foreground mb-4">
          Parameters by Equipment Type
        </h3>
        <div className="h-64">
          <Radar data={radarData} options={radarOptions} />
        </div>
      </motion.div>
    </div>
  );
}
