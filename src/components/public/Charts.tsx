'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { formatNairaShort } from '@/lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Common options
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#0a1e3d',
      titleFont: { family: 'Inter', size: 12, weight: 600 as const },
      bodyFont: { family: 'Inter', size: 12 },
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: function (context: { parsed: { y: number }; formattedValue: string; label: string; dataset: { label?: string } }) {
          const value = context.parsed.y ?? context.formattedValue;
          const label = context.dataset.label || context.label;
          return `${label}: ${formatNairaShort(Number(value))}`;
        },
      },
    },
  },
  scales: {
    y: {
      grid: { color: 'rgba(0,0,0,0.04)' },
      ticks: {
        font: { family: 'Inter', size: 11 },
        color: '#8d95a0',
        callback: function (value: string | number) {
          return formatNairaShort(Number(value));
        },
      },
    },
    x: {
      grid: { display: false },
      ticks: {
        font: { family: 'Inter', size: 11 },
        color: '#8d95a0',
      },
    },
  },
};

interface AllocationLineChartProps {
  labels: string[];
  data: number[];
  label?: string;
}

export function AllocationLineChart({ labels, data, label = 'Net Allocation' }: AllocationLineChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label,
        data,
        borderColor: '#0d8a4a',
        backgroundColor: 'rgba(13, 138, 74, 0.08)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: '#0d8a4a',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      },
    ],
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={commonOptions as never} />
    </div>
  );
}

interface AllocationBarChartProps {
  labels: string[];
  data: number[];
  label?: string;
  horizontal?: boolean;
}

export function AllocationBarChart({ labels, data, label = 'Net Allocation', horizontal = false }: AllocationBarChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label,
        data,
        backgroundColor: data.map((_, i) =>
          i % 2 === 0 ? 'rgba(10, 30, 61, 0.75)' : 'rgba(13, 138, 74, 0.75)'
        ),
        borderRadius: 4,
        maxBarThickness: 40,
      },
    ],
  };

  const options = {
    ...commonOptions,
    indexAxis: horizontal ? ('y' as const) : ('x' as const),
    scales: {
      ...commonOptions.scales,
      x: {
        ...commonOptions.scales.x,
        ticks: {
          ...commonOptions.scales.x.ticks,
          maxRotation: labels.length > 10 ? 45 : 0,
        },
      },
    },
  };

  return (
    <div className="chart-container" style={{ height: horizontal ? Math.max(320, labels.length * 32) : 320 }}>
      <Bar data={chartData} options={options as never} />
    </div>
  );
}

interface RevenueBreakdownChartProps {
  statutory: number;
  vat: number;
  excessCrude: number;
  other: number;
}

export function RevenueBreakdownChart({ statutory, vat, excessCrude, other }: RevenueBreakdownChartProps) {
  const chartData = {
    labels: ['Statutory Allocation', 'VAT Allocation', 'Excess Crude', 'Other Revenue'],
    datasets: [
      {
        data: [statutory, vat, excessCrude, other],
        backgroundColor: [
          'rgba(10, 30, 61, 0.8)',
          'rgba(13, 138, 74, 0.8)',
          'rgba(230, 161, 23, 0.8)',
          'rgba(124, 58, 237, 0.7)',
        ],
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          font: { family: 'Inter', size: 11 },
          color: '#5a6474',
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        ...commonOptions.plugins.tooltip,
        callbacks: {
          label: function (context: { label: string; parsed: number }) {
            return `${context.label}: ${formatNairaShort(context.parsed)}`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-container" style={{ height: 300 }}>
      <Doughnut data={chartData} options={options as never} />
    </div>
  );
}
