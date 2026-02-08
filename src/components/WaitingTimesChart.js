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
  TimeScale,
  ScatterController
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
  TimeScale,
  ScatterController
);

// --- CONFIGURATION ---
const COLOR_START = '#0072b2'; // Blue
const COLOR_END = '#009e73';   // Green
const COLOR_RANGE = '#cccccc'; // Grey

const ALLOWED_COUNTRIES = [
  'ΑΖΕΡΜΠΑΪΤΖΑΝ', 'ΑΡΜΕΝΙΑ', 'ΓΕΩΡΓΙΑ', 'ΕΣΘΟΝΙΑ', 'ΚΑΖΑΚΣΤΑΝ', 
  'ΚΙΡΓΙΣΤΑΝ', 'ΛΕΤΟΝΙΑ', 'ΛΕΥΚΟΡΩΣΙΑ', 'ΛΙΘΟΥΑΝΙΑ', 'ΜΟΛΔΑΒΙΑ', 
  'ΟΥΖΜΠΕΚΙΣΤΑΝ', 'ΟΥΚΡΑΝΙΑ', 'ΡΩΣΙΑ', 'ΤΑΤΖΙΚΙΣΤΑΝ', 'ΤΟΥΡΚΜΕΝΙΣΤΑΝ'
];

const COUNTRY_CODES = {
  'ΡΩΣΙΑ': 'ru', 'ΚΑΖΑΚΣΤΑΝ': 'kz', 'ΟΥΚΡΑΝΙΑ': 'ua', 'ΓΕΩΡΓΙΑ': 'ge',
  'ΟΥΖΜΠΕΚΙΣΤΑΝ': 'uz', 'ΑΡΜΕΝΙΑ': 'am', 'ΑΖΕΡΜΠΑΪΤΖΑΝ': 'az',
  'ΛΕΥΚΟΡΩΣΙΑ': 'by', 'ΜΟΛΔΑΒΙΑ': 'md', 'ΚΙΡΓΙΣΤΑΝ': 'kg', 'ΕΣΘΟΝΙΑ': 'ee',
  'ΛΕΤΟΝΙΑ': 'lv', 'ΛΙΘΟΥΑΝΙΑ': 'lt', 'ΤΑΤΖΙΚΙΣΤΑΝ': 'tj', 'ΤΟΥΡΚΜΕΝΙΣΤΑΝ': 'tm'
};

const GREEK_MONTHS = {
  'ΙΑΝΟΥΑΡΙΟΥ': 0, 'ΦΕΒΡΟΥΑΡΙΟΥ': 1, 'ΜΑΡΤΙΟΥ': 2, 'ΑΠΡΙΛΙΟΥ': 3,
  'ΜΑΪΟΥ': 4, 'ΙΟΥΝΙΟΥ': 5, 'ΙΟΥΛΙΟΥ': 6, 'ΑΥΓΟΥΣΤΟΥ': 7,
  'ΣΕΠΤΕΜΒΡΙΟΥ': 8, 'ΟΚΤΩΒΡΙΟΥ': 9, 'ΝΟΕΜΒΡΙΟΥ': 10, 'ΔΕΚΕΜΒΡΙΟΥ': 11
};

/**
 * Robust Date Parsing
 * Supports: DD/MM/YYYY, DD.MM.YYYY, DD-MM-YYYY, and DD Month YYYY (Greek)
 */
const parseDate = (str) => {
  if (!str || str.trim() === '-' || str.toUpperCase() === 'NO_DATA') return null;
  const cleanStr = str.trim().toUpperCase();
  
  // Numeric pattern: DD/MM/YYYY, DD.MM.YYYY, DD-MM-YYYY
  const numericMatch = cleanStr.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  if (numericMatch) {
    return new Date(numericMatch[3], numericMatch[2] - 1, numericMatch[1]).getTime();
  }

  // Greek pattern: "4 ΑΠΡΙΛΙΟΥ 2025"
  const greekMatch = cleanStr.match(/^(\d{1,2})\s+([Α-ΩΆΈΉΊΌΎΏ]+)\s+(\d{4})$/);
  if (greekMatch && GREEK_MONTHS[greekMatch[2]] !== undefined) {
    return new Date(greekMatch[3], GREEK_MONTHS[greekMatch[2]], greekMatch[1]).getTime();
  }
  return null;
};

const formatFekLabel = (label) => {
  if (!label) return '';
  return label
    .replace('.pdf', '')
    .replace(/_/g, ' ')
    .replace(/\s(\d{4})$/, '/$1');
};

const formatDate = (timestamp) => new Date(timestamp).toLocaleDateString('el-GR');

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
          const { x, y } = point.getProps(['x', 'y'], true);
          if (dataset.data[index]?.x && x && y) {
             const dateStr = formatDate(dataset.data[index].x);
             ctx.textAlign = (i === 1) ? 'right' : 'left';
             ctx.fillText(dateStr, x + (i === 1 ? -10 : 10), y + 3);
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
      }
    });
  }, []);

  const calculateMedian = (arr) => {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  };

  const calculateMetrics = (rows) => {
    if (rows.length === 0) return;
    const stats = { overall: { values: [] } };
    let maxDate = 0;

    rows.forEach(r => {
      stats.overall.values.push(r.duration);
      const year = new Date(r.start).getFullYear();
      if (!stats[year]) stats[year] = { values: [] };
      stats[year].values.push(r.duration);
      if (r.end > maxDate) maxDate = r.end;
    });

    const result = {};
    Object.keys(stats).forEach(k => {
      const vals = stats[k].values;
      const sorted = [...vals].sort((a,b) => a-b);
      result[k] = {
        mean: Math.round(vals.reduce((a,b) => a+b, 0) / vals.length),
        median: Math.round(vals.length % 2 !== 0 ? sorted[Math.floor(vals.length/2)] : (sorted[vals.length/2-1] + sorted[vals.length/2])/2)
      };
    });

    setLastUpdated(maxDate);
    setMetrics(result);
    setSortedYears(Object.keys(result).filter(k => k !== 'overall').sort((a,b) => b-a));
  };

  const processData = (data) => {
    const groups = {};
    const allRows = [];

    data.forEach(row => {
      if (Object.values(row).includes('NO_DATA')) return;

      const countryRaw = row['Country of Birth'] || '';
      const cleanCountry = countryRaw.replace(/:[a-z]+:/g, '').trim().toUpperCase();

      if (!ALLOWED_COUNTRIES.includes(cleanCountry)) return;
      
      const start = parseDate(row['Application date']);
      const end = parseDate(row['Circulation date']); 
      const fekLabel = formatFekLabel(row['FEK']);

      if (start && end && fekLabel) {
        const entry = { y: fekLabel, start, end, duration: Math.floor((end - start) / 86400000) };
        if (!groups[cleanCountry]) groups[cleanCountry] = [];
        groups[cleanCountry].push(entry);
        allRows.push(entry);
      }
    });

    // Sort by Circulation date (end) from recent to older
    Object.keys(groups).forEach(key => {
        groups[key].sort((a, b) => b.end - a.end);
    });

    calculateMetrics(allRows);
    setGroupedData(groups);
  };

  const getChartData = (rows) => ({
    labels: rows.map(r => r.y),
    datasets: [
      { type: 'bar', label: 'Range', data: rows.map(r => [r.start, r.end]), backgroundColor: COLOR_RANGE, barThickness: 2, order: 3 },
      { type: 'scatter', label: 'Подача заявления', data: rows.map(r => ({ x: r.start, y: r.y })), backgroundColor: COLOR_START, pointRadius: 5, order: 2 },
      { type: 'scatter', label: 'Публикация в газете', data: rows.map(r => ({ x: r.end, y: r.y })), backgroundColor: COLOR_END, pointRadius: 5, order: 1 }
    ]
  });

  const getMaxScaleDate = () => {
    const today = new Date();
    const latestDataDate = lastUpdated ? new Date(lastUpdated) : today;
    const refDate = latestDataDate > today ? latestDataDate : today;
    return new Date(refDate.getFullYear() + 1, 0, 1).getTime();
  };

  const textColor = isDark ? '#e5e7eb' : '#000000';

  return (
    <div>
        <h2 className="text--center" style={{ color: textColor }}>Время рассмотрения дел</h2>
        
        {metrics && (
          <div className="row margin-bottom--lg" style={{justifyContent: 'center'}}>
            <div className="col col--3"><div className="card shadow--sm padding--md text--center">
                <div style={{fontSize: '2rem', fontWeight: 'bold', color: COLOR_START}}>{metrics.overall.mean}</div>
                <div style={{fontWeight: 'bold', color: textColor}}>Среднее (все годы)</div>
                <small style={{color: textColor}}>Медиана: {metrics.overall.median}</small>
            </div></div>
            {sortedYears.slice(0, 4).map(y => (
              <div key={y} className="col col--2"><div className="card shadow--sm padding--md text--center">
                  <div style={{fontSize: '1.2rem', fontWeight: 'bold', color: textColor}}>{metrics[y].mean}</div>
                  <div style={{fontWeight: 'bold', color: textColor, fontSize: '0.8rem'}}>Подача {y}</div>
                  <small style={{color: textColor, fontSize: '0.7rem'}}>Медиана: {metrics[y].median}</small>
              </div></div>
            ))}
          </div>
        )}

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

        {Object.keys(groupedData).map((country) => {
            const rows = groupedData[country];
            const height = (rows.length * 45) + 140; 

            return (
                <div key={country} className="card shadow--sm margin-bottom--lg" style={{ padding: '10px 20px', height: `${height}px` }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #eee' }}>
                        {COUNTRY_CODES[country] && (
                            <img src={`https://flagcdn.com/24x18/${COUNTRY_CODES[country]}.png`} alt="" style={{ marginRight: '10px' }} />
                        )}
                        <h3 style={{ margin: 0, color: textColor }}>{country}</h3>
                    </div>
                    <Chart 
                        type='bar' 
                        data={getChartData(rows)} 
                        plugins={[dateLabelsPlugin]}
                        options={{
                            indexAxis: 'y', responsive: true, maintainAspectRatio: false, isDark,
                            plugins: { legend: { display: false } },
                            scales: {
                                x: { 
                                    type: 'time', 
                                    position: 'top', 
                                    min: new Date(2005, 0, 1).getTime(), 
                                    max: getMaxScaleDate(),
                                    grid: { color: isDark ? '#374151' : '#e0e0e0' } 
                                },
                                y: { grid: { display: false }, ticks: { color: textColor, padding: 10 } }
                            }
                        }} 
                    />
                </div>
            );
        })}
    </div>
  );
}