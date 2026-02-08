import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import Papa from 'papaparse';
import { useColorMode } from '@docusaurus/theme-common';

// Register components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  Title, 
  Tooltip, 
  Legend,
  TimeScale
);

// --- CONFIGURATION ---
const COLOR_START = '#0072b2'; // Blue
const COLOR_END = '#009e73';   // Green
const COLOR_RANGE = '#cccccc'; // Grey

// Map Country Names (from CSV) to ISO Codes for FlagCDN
const COUNTRY_CODES = {
  'ΡΩΣΙΑ': 'ru', 'RUSSIA': 'ru',
  'ΚΑΖΑΚΣΤΑΝ': 'kz', 'KAZAKHSTAN': 'kz',
  'ΟΥΚΡΑΝΙΑ': 'ua', 'UKRAINE': 'ua',
  'ΓΕΩΡΓΙΑ': 'ge', 'GEORGIA': 'ge',
  'ΟΥΖΜΠΕΚΙΣΤΑΝ': 'uz', 'UZBEKISTAN': 'uz',
  'ΑΡΜΕΝΙΑ': 'am', 'ARMENIA': 'am',
  'ΑΖΕΡΜΠΑΪΤΖΑΝ': 'az', 'AZERBAIJAN': 'az',
  'ΛΕΥΚΟΡΩΣΙΑ': 'by', 'BELARUS': 'by',
  'ΜΟΛΔΑΒΙΑ': 'md', 'MOLDOVA': 'md',
  'ΚΙΡΓΙΣΤΑΝ': 'kg', 'KYRGYZSTAN': 'kg'
};

const getCountryCode = (countryName) => {
  if (!countryName) return null;
  const clean = countryName.replace(/:[a-z]+:/g, '').trim().toUpperCase();
  return COUNTRY_CODES[clean] || null;
};

const parseDate = (str) => {
  if (!str) return null;
  const parts = str.split('/');
  if (parts.length !== 3) return null;
  return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
};

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('el-GR');
};

// --- CUSTOM PLUGIN FOR DATE LABELS ---
const dateLabelsPlugin = {
  id: 'dateLabels',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const isDark = chart.options.isDark; 
    
    ctx.save();
    ctx.font = '700 10px sans-serif'; 
    ctx.fillStyle = isDark ? '#ffffff' : '#333333'; 

    chart.data.datasets.forEach((dataset, i) => {
      if (dataset.type === 'scatter') {
        const meta = chart.getDatasetMeta(i);
        meta.data.forEach((point, index) => {
          if (!point.getProps) return;
          const { x, y } = point.getProps(['x', 'y'], true);
          
          if (dataset.data[index] && dataset.data[index].x) {
             const timestamp = dataset.data[index].x;
             const dateStr = new Date(timestamp).toLocaleDateString('el-GR', {
                 day: '2-digit', month: '2-digit', year: 'numeric'
             });
             
             const isStart = (i === 1); 
             ctx.textAlign = isStart ? 'right' : 'left';
             const padding = 10;
             
             if (x && y) {
               ctx.fillText(dateStr, x + (isStart ? -padding : padding), y + 3);
             }
          }
        });
      }
    });
    ctx.restore();
  }
};

export default function WaitingTimesChart() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [groupedData, setGroupedData] = useState({});
  const [metrics, setMetrics] = useState(null);
  const [sortedYears, setSortedYears] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSbTUc_X_2PS4Xk598xAXPCqDlQW_SZd4pAulalvNEyWPhC7CmxBLmiyetckhQFxMIrjviBxl2TXu-W/pub?gid=1473720245&single=true&output=csv';

  useEffect(() => {
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        processData(results.data);
        setLoading(false);
      },
      error: (err) => console.error('Error:', err)
    });
  }, []);

  const calculateMedian = (arr) => {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  };

  const calculateMetrics = (rows) => {
    const stats = {
      overall: { values: [] },
    };

    let maxDate = 0;

    rows.forEach(r => {
      if (r.duration > 0) {
        stats.overall.values.push(r.duration);
        const appYear = new Date(r.start).getFullYear();
        if (!stats[appYear]) stats[appYear] = { values: [] };
        stats[appYear].values.push(r.duration);
        if (r.end > maxDate) maxDate = r.end;
      }
    });

    setLastUpdated(maxDate);

    const result = {};
    Object.keys(stats).forEach(key => {
        const values = stats[key].values;
        const sum = values.reduce((a, b) => a + b, 0);
        result[key] = {
            mean: Math.round(sum / values.length),
            median: Math.round(calculateMedian(values)),
            count: values.length
        };
    });

    setMetrics(result);
    setSortedYears(Object.keys(result).filter(k => k !== 'overall').sort((a,b) => b-a));
  };

  const processData = (data) => {
    const groups = {};
    const allRows = [];

    data.forEach(row => {
      let country = row['Country of Birth']?.trim();
      if (!country) return;
      
      const start = parseDate(row['Application date']);
      const end = parseDate(row['FEK date']);
      const fekLabel = row['FEK'];

      if (!start || !end || !fekLabel) return;

      const entry = {
        y: fekLabel,
        start,
        end,
        duration: Math.floor((end - start) / (1000 * 60 * 60 * 24))
      };

      const cleanCountry = country.replace(/:[a-z]+:/g, '').trim().toUpperCase();

      if (!groups[cleanCountry]) groups[cleanCountry] = [];
      groups[cleanCountry].push(entry);
      allRows.push(entry);
    });

    Object.keys(groups).forEach(key => {
        groups[key].sort((a, b) => b.end - a.end);
    });

    calculateMetrics(allRows);
    setGroupedData(groups);
  };

  const getChartData = (rows) => {
    const labels = rows.map(r => r.y);
    return {
      labels,
      datasets: [
        {
          type: 'bar',
          label: 'Range',
          data: rows.map(r => [r.start, r.end]),
          backgroundColor: COLOR_RANGE,
          barThickness: 2, 
          borderRadius: 2,
          order: 3 
        },
        {
          type: 'scatter',
          label: 'Подача заявления',
          data: rows.map(r => ({ x: r.start, y: r.y })),
          backgroundColor: COLOR_START,
          pointRadius: 5,
          pointHoverRadius: 7,
          order: 2
        },
        {
          type: 'scatter',
          label: 'Публикация в газете',
          data: rows.map(r => ({ x: r.end, y: r.y })),
          backgroundColor: COLOR_END,
          pointRadius: 5,
          pointHoverRadius: 7,
          order: 1
        }
      ]
    };
  };

  const getOptions = (countryName) => ({
    indexAxis: 'y',
    isDark: isDark,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false }, // Disabled native title to use HTML instead
      tooltip: {
        callbacks: {
          label: (context) => {
            const raw = context.raw;
            if (context.dataset.type === 'bar') {
               const days = Math.floor((raw[1] - raw[0]) / (86400000));
               return `Ожидание: ${days} дней`;
            }
            return formatDate(raw.x);
          }
        }
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'year',
          displayFormats: { year: 'yyyy' }
        },
        min: new Date(2005, 0, 1).getTime(),
        max: new Date().getTime() + (1000 * 60 * 60 * 24 * 365), 
        grid: {
          display: true,
          drawBorder: false,
          color: isDark ? '#374151' : '#e0e0e0',
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#666',
          maxTicksLimit: 20
        },
        position: 'top'
      },
      y: {
        grid: { 
            display: true, 
            color: isDark ? '#374151' : '#f0f0f0',
            drawBorder: false
        },
        ticks: {
          color: isDark ? '#e5e7eb' : '#333',
          font: { weight: '500' }
        }
      }
    }
  });

  if (loading) return <div className="text--center padding--lg">Loading...</div>;

  const textColor = isDark ? '#e5e7eb' : '#000000';

  return (
    <div>
        <h2 className="text--center margin-bottom--md" style={{ color: textColor }}>
            Время рассмотрения дел
        </h2>

        {/* METRICS DASHBOARD */}
        {metrics && (
          <div className="row margin-bottom--lg" style={{justifyContent: 'center'}}>
            <div className="col col--3 margin-bottom--md">
              <div className="card shadow--sm padding--md text--center">
                <div style={{fontSize: '2rem', fontWeight: 'bold', color: COLOR_START}}>
                    {metrics.overall.mean}
                </div>
                <div style={{color: textColor, fontWeight: 'bold', fontSize: '0.9rem'}}>
                    Среднее (все годы)
                </div>
                <div style={{color: textColor, fontSize: '0.85rem', opacity: 0.8}}>
                    Медиана: {metrics.overall.median}
                </div>
              </div>
            </div>

            {sortedYears.slice(0, 3).map(year => (
                <div key={year} className="col col--3 margin-bottom--md">
                  <div className="card shadow--sm padding--md text--center">
                    <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: textColor}}>
                        {metrics[year].mean}
                    </div>
                    <div style={{color: textColor, fontWeight: 'bold', fontSize: '0.8rem'}}>
                        Подача {year}
                    </div>
                    <div style={{color: textColor, fontSize: '0.8rem', opacity: 0.8}}>
                        Медиана: {metrics[year].median}
                    </div>
                  </div>
                </div>
            ))}
          </div>
        )}
        
        {/* LEGEND */}
        <div className="row margin-bottom--md" style={{justifyContent: 'center', fontSize: '0.9rem', color: textColor}}>
            <div style={{display: 'flex', alignItems: 'center', marginRight: '20px'}}>
                <span style={{width: 12, height: 12, borderRadius: '50%', background: COLOR_START, display: 'inline-block', marginRight: 8}}></span>
                <strong>Подача заявления</strong>
            </div>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <span style={{width: 12, height: 12, borderRadius: '50%', background: COLOR_END, display: 'inline-block', marginRight: 8}}></span>
                <strong>Публикация в газете</strong>
            </div>
        </div>

        {/* CHARTS */}
        {Object.keys(groupedData).map((country) => {
            const rows = groupedData[country];
            if (rows.length === 0) return null;

            const height = (rows.length * 40) + 100;
            const flagCode = getCountryCode(country);

            return (
                <div key={country} className="card shadow--sm margin-bottom--lg" style={{ padding: '10px 20px', height: `${height}px` }}>
                    {/* CUSTOM HEADER WITH FLAG IMAGE */}
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginBottom: '10px', 
                        borderBottom: '1px solid #eee', 
                        paddingBottom: '5px' 
                    }}>
                        {flagCode && (
                            <img 
                                src={`https://flagcdn.com/24x18/${flagCode}.png`} 
                                alt={country} 
                                style={{ marginRight: '10px', borderRadius: '2px' }} 
                            />
                        )}
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: textColor }}>{country}</h3>
                    </div>

                    <Chart 
                        type='bar' 
                        data={getChartData(rows)} 
                        options={getOptions(country)} 
                        plugins={[dateLabelsPlugin]}
                    />
                </div>
            );
        })}
        
        {/* FOOTER */}
        <div className="text--center margin-top--sm" style={{ color: textColor }}>
            <p style={{marginBottom: '0.2rem', fontWeight: 'bold'}}>
                Источник: Официальные публикации (FEK)
            </p>
            {lastUpdated && (
                <small style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                    Последнее обновление данных: {formatDate(lastUpdated)}
                </small>
            )}
        </div>
    </div>
  );
}