import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Papa from 'papaparse';
import Translate, { translate } from '@docusaurus/Translate';
import { useColorMode } from '@docusaurus/theme-common';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function OfficialStatistics() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSbTUc_X_2PS4Xk598xAXPCqDlQW_SZd4pAulalvNEyWPhC7CmxBLmiyetckhQFxMIrjviBxl2TXu-W/pub?gid=74201684&single=true&output=csv';

  useEffect(() => {
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        processData(results.data);
        setLoading(false);
      },
      error: (err) => {
        console.error('Error fetching official stats:', err);
        setLoading(false);
      }
    });
  }, []);

  const processData = (data) => {
    const sortedData = data.sort((a, b) => a.Year - b.Year);
    const labels = sortedData.map(item => item.Year);
    const accepted = sortedData.map(item => Number(item.Accepted));
    const rejected = sortedData.map(item => Number(item.Rejected));

    setChartData({
      labels,
      datasets: [
        {
          label: translate({message: 'Положительные решения', id: 'official.stats.accepted'}),
          data: accepted,
          backgroundColor: '#009e73',
          borderColor: isDark ? '#333' : '#fff',
          borderWidth: 1,
        },
        {
          label: translate({message: 'Отказы', id: 'official.stats.rejected'}),
          data: rejected,
          backgroundColor: '#d55e00',
          borderColor: isDark ? '#333' : '#fff',
          borderWidth: 1,
        },
      ],
    });
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: isDark ? '#e5e7eb' : '#374151' },
      },
      title: {
        display: true,
        text: translate({
            message: 'Официальная статистика по натурализации (МВД Греции)', 
            id: 'official.stats.title'
        }),
        color: isDark ? '#e5e7eb' : '#111827',
        font: { size: 16 },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: { color: isDark ? '#e5e7eb' : '#374151' },
        grid: { display: false },
      },
      y: {
        stacked: true,
        ticks: { color: isDark ? '#e5e7eb' : '#374151' },
        grid: { color: isDark ? '#374151' : '#e5e7eb' },
      },
    },
  };

  if (loading) return (
    <div className="text--center padding--lg">
        <Translate id="official.loading">Загрузка данных...</Translate>
    </div>
  );
  
  if (!chartData) return null;

  return (
    <div className="card shadow--md" style={{ 
      height: '550px',         // Increased height slightly
      width: '100%', 
      padding: '20px', 
      marginBottom: '2rem',
      display: 'flex',         // Use Flexbox
      flexDirection: 'column'  // Stack children vertically
    }}>
      {/* Chart Wrapper: Grows to fill available space */}
      <div style={{ flexGrow: 1, position: 'relative', minHeight: 0 }}>
        <Bar options={options} data={chartData} />
      </div>

      {/* Footer: Stays at the bottom naturally */}
      <div className="text--center margin-top--md" style={{ zIndex: 10 }}>
        <small style={{ color: isDark ? '#9ca3af' : '#4b5563' }}>
          <Translate id="official.stats.source_prefix">Источник: </Translate>
          <a 
            href="https://www.ypes.gr/g-g-ithageneias/statistika-stoixeia/arithmos-apofaseon" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ fontWeight: 'bold', textDecoration: 'underline' }}
          >
            <Translate id="official.stats.source_name">Министерство Внутренних Дел Греции</Translate>
          </a>
        </small>
      </div>
    </div>
  );
}