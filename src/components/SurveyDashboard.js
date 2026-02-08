import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import Papa from 'papaparse';
import Translate, { translate } from '@docusaurus/Translate';
import { useColorMode } from '@docusaurus/theme-common';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const WRAP_LENGTH = 30;

// Blue palette (Dark to Light)
const BLUE_PALETTE = [
  'rgba(37, 99, 235, 0.8)',   // Primary Blue
  'rgba(59, 130, 246, 0.8)',  // Lighter Blue
  'rgba(96, 165, 250, 0.8)',  // Sky Blue
  'rgba(147, 197, 253, 0.8)', // Pale Blue
  'rgba(30, 64, 175, 0.8)',   // Darker Blue
  'rgba(29, 78, 216, 0.8)',   // Deep Blue
  'rgba(191, 219, 254, 0.8)', // Very Light Blue
];

// Helper to wrap long text into arrays for Chart.js
const wrapText = (str) => {
  if (!str) return str;
  const words = str.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    if (currentLine.length + words[i].length + 1 <= WRAP_LENGTH) {
      currentLine += ' ' + words[i];
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);
  return lines;
};

// Helper to parse currency strings
const parseCurrency = (str) => {
  if (!str) return 0;
  const clean = str.replace(/[^0-9.,]/g, '');
  const normalized = clean.replace(',', '.');
  return parseFloat(normalized) || 0;
};

export default function SurveyDashboard() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStories, setShowStories] = useState(false); // State for toggling stories

  const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSbTUc_X_2PS4Xk598xAXPCqDlQW_SZd4pAulalvNEyWPhC7CmxBLmiyetckhQFxMIrjviBxl2TXu-W/pub?gid=1887272377&single=true&output=csv';

  useEffect(() => {
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
        setLoading(false);
      },
      error: (err) => console.error('Error loading CSV:', err),
    });
  }, []);

  // --- PREDEFINED LISTS ---
  const CONSULATES = [
    'Казахстан, Астана', 'Россия, Москва', 'Россия, Спб', 'Россия, Новороссийск',
    'Грузия, Тбилиси', 'Украина, Киев', 'Армения, Ереван', 'Беларусь, Минск',
    'Узбекистан, Ташкент', 'Азербайджан, Баку', 'Афины, Греция'
  ];

  const LANGUAGE_LEVELS = [
    'Говорю / понимаю',
    'Учу с преподавателем или сам(а)',
    'Поздно и тяжело учить язык в моем возрасте, особенно вне языковой среды',
    'Принципиально не учу - я грек вне зависимости от знания языка. Я не выбирал, где родиться'
  ];

  const HISTORY_LEVELS = [
    'Да, обладаю достаточным кругозором',
    'Нет, но изучаю, готовлюсь',
    'Нет желания изучать специально для собеседований/экзаменов'
  ];

  const DISCRIMINATION_TYPES = [
    'Да, я или мои родители/родственники не могли устроиться на работу, поступить на учебу в результате отказа по национальному признаку',
    'Да, меня оскорбляли в связи с моей национальностью',
    'Да, я сталкивался с ущемление моих прав на основании национальной приндалежности',
    'Нет'
  ];

  // --- DATA PROCESSORS ---
  const processGeneric = (rows, column) => {
    const counts = {};
    rows.forEach(row => {
      const val = row[column]?.trim();
      if (val) counts[val] = (counts[val] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  };

  const processWithPredefined = (rows, column, allowedList) => {
    const counts = {};
    const normalizedList = allowedList.map(i => i.toLowerCase().trim());
    
    rows.forEach(row => {
      let val = row[column]?.trim();
      if (!val) return;
      const exactMatch = allowedList.find(item => item === val);
      
      if (exactMatch) {
        counts[exactMatch] = (counts[exactMatch] || 0) + 1;
      } else {
        const partialMatch = allowedList.find(item => val.startsWith(item.substring(0, 20)));
        if (partialMatch) {
          counts[partialMatch] = (counts[partialMatch] || 0) + 1;
        } else {
          counts['Другое'] = (counts['Другое'] || 0) + 1;
        }
      }
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  };

  const processAge = (rows, column) => {
    const counts = {};
    rows.forEach(row => {
      const val = row[column]?.trim();
      if (val) counts[val] = (counts[val] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true }));
  };

  const processMoney = (rows, column) => {
    const buckets = {
      '0 - 500 €': 0,
      '501 - 1000 €': 0,
      '1001 - 2000 €': 0,
      '2001 - 5000 €': 0,
      '5000+ €': 0
    };
    rows.forEach(row => {
      const valStr = row[column];
      if (!valStr) return;
      const amount = parseCurrency(valStr);
      if (amount <= 500) buckets['0 - 500 €']++;
      else if (amount <= 1000) buckets['501 - 1000 €']++;
      else if (amount <= 2000) buckets['1001 - 2000 €']++;
      else if (amount <= 5000) buckets['2001 - 5000 €']++;
      else buckets['5000+ €']++;
    });
    return Object.entries(buckets);
  };

  const processNumericLabels = (rows, column) => {
    const counts = {};
    rows.forEach(row => {
      let val = row[column]?.trim();
      if (!val) return;
      const match = val.match(/\d+/);
      if (match) {
        val = match[0];
        counts[val] = (counts[val] || 0) + 1;
      }
    });
    return Object.entries(counts).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
  };


  const chartsConfig = [
    {
      title: translate({message: 'Статус подачи', id: 'survey.status.title'}),
      column: 'Подавали ли Вы ходатайство о гражданстве Греции? ',
      type: 'Pie',
      processor: processGeneric
    },
    {
      title: translate({message: 'Причины, если не подавали', id: 'survey.reason_not_submitted'}),
      column: 'Если Вы НЕ подавали ходатайство о гражданстве - то в чем причина? ',
      type: 'Bar',
      indexAxis: 'y',
      processor: processGeneric
    },
    {
      title: translate({message: 'Возраст', id: 'survey.age'}),
      column: 'Возраст',
      type: 'Bar',
      processor: processAge
    },
    {
      title: translate({message: 'Консульство подачи', id: 'survey.consulate'}),
      column: 'В консульстве какого города планируете подавать ходатайство?',
      type: 'Bar',
      processor: (rows, col) => processWithPredefined(rows, col, CONSULATES)
    },
    {
      title: translate({message: 'Знание греческого языка', id: 'survey.greek_lang'}),
      column: 'Знаете ли Вы греческий язык?',
      type: 'Bar',
      indexAxis: 'y',
      processor: (rows, col) => processWithPredefined(rows, col, LANGUAGE_LEVELS)
    },
    {
      title: translate({message: 'Знание культуры и истории', id: 'survey.history_culture'}),
      column: 'Знаете ли греческую культуру и историю на нужном уровне для собеседования в консульстве? ',
      type: 'Bar',
      indexAxis: 'y',
      processor: (rows, col) => processWithPredefined(rows, col, HISTORY_LEVELS)
    },
    {
      title: translate({message: 'Отказы в гражданстве', id: 'survey.refusals'}),
      column: 'Вопрос к подавшим ходатайство: Вам уже отказали в гражданстве? ',
      type: 'Pie',
      processor: processGeneric
    },
    {
      title: translate({message: 'Причины отказа', id: 'survey.refusal_reason'}),
      column: 'Вопрос про отказы: укажите основание, которое Вам озвучили ',
      type: 'Bar',
      indexAxis: 'y',
      processor: processGeneric
    },
    {
      title: translate({message: 'Срок ожидания (лет)', id: 'survey.waiting_time'}),
      column: 'Сколько лет с момента подачи ходатайства Вы ждете решения? ',
      type: 'Bar',
      processor: processNumericLabels
    },
    {
      title: translate({message: 'Затраты на документы', id: 'survey.costs'}),
      column: 'Сколько денег Вам пришлось потратить на сбор документов (истребование, апостиль, переводы, пересылка между странами)?',
      type: 'Bar',
      processor: processMoney
    },
    // CHANGED TO BAR CHART
    {
      title: translate({message: 'Формат подачи (кол-во человек)', id: 'survey.family_format'}),
      column: 'Вы подаете ходатайство самостоятельно или семьей? Количество членов семьи, претендующих на гражданство? ',
      type: 'Bar', 
      processor: processNumericLabels
    },
    {
      title: translate({message: 'Дискриминация', id: 'survey.discrimination'}),
      column: 'Приходилось ли Вам / Вашим родителям/ родственникам подвергаться в той или иной форме дискриминации по национальному признаку в условно "наше" время? ',
      type: 'Pie',
      processor: (rows, col) => processWithPredefined(rows, col, DISCRIMINATION_TYPES)
    }
  ];

  const getDiscriminationStories = () => {
    const stories = [];
    data.forEach(row => {
      const storyKey = Object.keys(row).find(k => k.trim().startsWith('Расскажите об этом'));
      const typeKey = Object.keys(row).find(k => k.trim().startsWith('Приходилось ли Вам'));
      
      const story = row[storyKey]?.trim();
      const type = row[typeKey]?.trim();

      if (story && story.length > 5) {
        stories.push({ type, text: story });
      }
    });
    return stories;
  };

  const getChartData = (config) => {
    const colName = config.column;
    const actualCol = data.length > 0 ? Object.keys(data[0]).find(k => k.trim() === colName.trim()) : null;

    if (!actualCol) return { labels: [], datasets: [] };

    const sortedEntries = config.processor(data, actualCol);
    if (!sortedEntries || sortedEntries.length === 0) return { labels: [], datasets: [] };

    return {
      labels: sortedEntries.map(entry => config.type === 'Bar' ? wrapText(entry[0]) : entry[0]),
      datasets: [
        {
          label: translate({message: 'Количество', id: 'survey.chart.count'}),
          data: sortedEntries.map(entry => entry[1]),
          // USE BLUE PALETTE
          backgroundColor: sortedEntries.map((_, i) => BLUE_PALETTE[i % BLUE_PALETTE.length]),
          borderColor: isDark ? '#333' : '#fff',
          borderWidth: 1,
        },
      ],
    };
  };

  const getOptions = (type, indexAxis) => {
    const isPie = type === 'Pie';
    return {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: indexAxis || 'x',
      plugins: {
        legend: {
          display: isPie,
          position: 'bottom',
          labels: { color: isDark ? '#e5e7eb' : '#374151', padding: 20 },
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += context.parsed.y || context.parsed;
                    } else {
                        label += context.raw;
                    }
                    return label;
                }
            }
        }
      },
      scales: isPie ? {
        x: { display: false },
        y: { display: false }
      } : {
        x: { 
            ticks: { color: isDark ? '#e5e7eb' : '#374151' }, 
            grid: { display: false }
        },
        y: { 
            ticks: { color: isDark ? '#e5e7eb' : '#374151' },
            grid: { color: isDark ? '#374151' : '#e5e7eb' }
        }
      }
    };
  };

  if (loading) return (
    <div className="text--center padding--lg">
        <Translate id="survey.loading">Загрузка данных...</Translate>
    </div>
  );

  const stories = getDiscriminationStories();

  return (
    <div className="container">
      <div className="row">
        {chartsConfig.map((chart, index) => {
          const chartData = getChartData(chart);
          if (chartData.labels.length === 0) return null;

          return (
            <div key={index} className="col col--6 margin-bottom--lg">
              <div className="card shadow--md" style={{ height: '500px', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                <h3 className="text--center" style={{ marginBottom: '1rem', minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                  {chart.title}
                </h3>
                <div style={{ flexGrow: 1, position: 'relative' }}>
                  {chart.type === 'Pie' ? (
                    <Pie data={chartData} options={getOptions('Pie')} />
                  ) : (
                    <Bar data={chartData} options={getOptions('Bar', chart.indexAxis)} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stories Section with Toggle Button */}
      {stories.length > 0 && (
        <div className="margin-top--xl text--center">
            <h2 className="margin-bottom--lg">
                <Translate id="survey.stories.title">Истории о дискриминации</Translate>
            </h2>
            
            <button 
                className="button button--primary button--lg margin-bottom--lg"
                onClick={() => setShowStories(!showStories)}
            >
                {showStories 
                    ? translate({message: 'Скрыть истории', id: 'survey.stories.hide'}) 
                    : translate({message: 'Показать истории', id: 'survey.stories.show'})}
            </button>

            {showStories && (
                <div className="row text--left">
                    {stories.map((story, i) => (
                        <div key={i} className="col col--12 margin-bottom--md">
                            <div className="card shadow--sm padding--md" style={{borderLeft: '4px solid #f87171'}}>
                                <p><strong>{story.type}</strong></p>
                                <p style={{whiteSpace: 'pre-wrap'}}>{story.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}
      
      <div className="text--center margin-top--md text--secondary">
        <small>
            <Translate id="survey.footer.updated" values={{count: data.length}}>
                {'Данные обновляются автоматически из Google Forms. Всего ответов: {count}'}
            </Translate>
        </small>
      </div>
    </div>
  );
}