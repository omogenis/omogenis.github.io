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
 */
const parseDate = (str) => {
  if (!str || str.trim() === '-' || str.toUpperCase() === 'NO_DATA') return null;
  const cleanStr = str.trim().toUpperCase();
  
  // Numeric pattern
  const numericMatch = cleanStr.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  if (numericMatch) {
    return new Date(numericMatch[3], numericMatch[2] - 1, numericMatch[1]).getTime();
  }

  // Greek pattern
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
  const [volumeStats, setVolumeStats] = useState([]);
  const [collectionDate, setCollectionDate] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSbTUc_X_2PS4Xk598xAXPCqDlQW_SZd4pAulalvNEyWPhC7CmxBLmiyetckhQFxMIrjviBxl2TXu-W/pub?gid=1473720245&single=true&output=csv';

  useEffect(() => {
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Extract Data Collection Date from headers
        // Structure: ... , "Data Collection", "10/2/2026"
        const fields = results.meta.fields || [];
        const labelIndex = fields.indexOf('Data Collection');
        if (labelIndex !== -1 && fields[labelIndex + 1]) {
            setCollectionDate(fields[labelIndex + 1]);
        }

        processData(results.data);
        setLoading(false);
      }
    });
  }, []);

  const calculateMetrics = (rows) => {
    if (rows.length === 0) return;
    
    // 1. Duration Stats (Wait Time)
    const stats = { overall: { values: [] } };
    let maxDate = 0;
    
    // 2. Volume Stats (Decision Counts)
    const decisionCountsByYear = {};
    let maxDecisionYear = 0;

    rows.forEach(r => {
      // Duration Data
      stats.overall.values.push(r.duration);
      const startYear = new Date(r.start).getFullYear();
      if (!stats[startYear]) stats[startYear] = { values: [] };
      stats[startYear].values.push(r.duration);
      
      if (r.end > maxDate) maxDate = r.end;

      // Volume Data (Based on End/Circulation Date)
      const endYear = new Date(r.end).getFullYear();
      decisionCountsByYear[endYear] = (decisionCountsByYear[endYear] || 0) + 1;
      if (endYear > maxDecisionYear) maxDecisionYear = endYear;
    });

    // Process Duration Stats
    const result = {};
    Object.keys(stats).forEach(k => {
      const vals = stats[k].values;
      const sorted = [...vals].sort((a,b) => a-b);
      result[k] = {
        mean: Math.round(vals.reduce((a,b) => a+b, 0) / vals.length),
        median: Math.round(vals.length % 2 !== 0 ? sorted[Math.floor(vals.length/2)] : (sorted[vals.length/2-1] + sorted[vals.length/2])/2)
      };
    });

    // Process Volume Stats (Last 4 Years from maxDecisionYear)
    const recentVolume = [];
    for (let i = 0; i < 4; i++) {
        const y = maxDecisionYear - i;
        if (y > 0) { // Safety check
            recentVolume.push({ year: y, count: decisionCountsByYear[y] || 0 });
        }
    }

    setLastUpdated(maxDate);
    setMetrics({ ...result, totalDecisions: rows.length });
    setSortedYears(Object.keys(result).filter(k => k !== 'overall').sort((a,b) => b-a));
    setVolumeStats(recentVolume);
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
        <h2 className="text--center" style={{ color: textColor, marginBottom: '0.5rem' }}>Статистика и время рассмотрения</h2>
        
        {collectionDate && (
           <p className="text--center" style={{ color: textColor, opacity: 0.7, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
             Дата обновления данных: <strong>{collectionDate}</strong>
           </p>
        )}

        {metrics && (
          <>
            {/* --- SECTION 1: VOLUME STATISTICS (COUNTS) --- */}
            <div className="row margin-bottom--sm" style={{justifyContent: 'center'}}>
                <div className="col col--3">
                    <div className="card shadow--sm padding--md text--center" style={{border: `1px solid ${COLOR_END}`}}>
                        <div style={{fontSize: '2rem', fontWeight: 'bold', color: COLOR_END}}>{metrics.totalDecisions}</div>
                        <div style={{fontWeight: 'bold', color: textColor}}>Всего решений</div>
                        <small style={{color: textColor, opacity: 0.7}}>В базе данных</small>
                    </div>
                </div>
                {volumeStats.map(stat => (
                    <div key={`vol-${stat.year}`} className="col col--2">
                        <div className="card shadow--sm padding--md text--center">
                            <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: textColor}}>{stat.count}</div>
                            <div style={{fontWeight: 'bold', color: textColor, fontSize: '0.8rem'}}>Решений в {stat.year}</div>
                        </div>
                    </div>
                ))}
            </div>

            <hr style={{margin: '2rem 0', opacity: 0.2}}/>

            {/* --- SECTION 2: WAIT TIME STATISTICS (DURATION) --- */}
            <h3 className="text--center" style={{ color: textColor, fontSize: '1.2rem', marginBottom: '1rem' }}>Среднее время ожидания (по году подачи)</h3>
            <div className="row margin-bottom--lg" style={{justifyContent: 'center'}}>
                <div className="col col--3">
                    <div className="card shadow--sm padding--md text--center" style={{backgroundColor: isDark ? '#1f2937' : '#f3f4f6'}}>
                        <div style={{fontSize: '2rem', fontWeight: 'bold', color: COLOR_START}}>{metrics.overall.mean}</div>
                        <div style={{fontWeight: 'bold', color: textColor}}>Среднее (дни)</div>
                        <small style={{color: textColor}}>Медиана: {metrics.overall.median}</small>
                    </div>
                </div>
                {sortedYears.slice(0, 4).map(y => (
                    <div key={`wait-${y}`} className="col col--2">
                        <div className="card shadow--sm padding--md text--center">
                            <div style={{fontSize: '1.2rem', fontWeight: 'bold', color: textColor}}>{metrics[y].mean}</div>
                            <div style={{fontWeight: 'bold', color: textColor, fontSize: '0.8rem'}}>Подача {y}</div>
                            <small style={{color: textColor, fontSize: '0.7rem'}}>Медиана: {metrics[y].median}</small>
                        </div>
                    </div>
                ))}
            </div>
          </>
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
                        <h3 style={{ margin: 0, color: textColor }}>
                            {country} <span style={{fontSize: '0.8rem', fontWeight: 'normal', opacity: 0.7, marginLeft: '8px'}}>(Страна рождения)</span>
                        </h3>
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