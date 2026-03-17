// API Base URLs
export const API_URLS = {
  CSO: 'https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset',
  ECB: 'https://sdw-wsrest.ecb.europa.eu/service/data',
  EUROSTAT: 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data',
  OECD: 'https://sdmx.oecd.org/public/rest/data',
  WORLD_BANK: 'https://api.worldbank.org/v2',
}

// CSO Dataset IDs
export const CSO_DATASETS = {
  CPI: 'CPM01',
  LABOUR_FORCE: 'QLF18',
  GDP: 'NQQ38',
  HOUSE_PRICES: 'HPM09',
  RETAIL_SALES: 'TSA09',
  PLANNING: 'BPA04',
}

// ECB Series Keys
export const ECB_SERIES = {
  HICP_IRELAND: 'ICP/M.IE.N.000000.4.ANR',
  EURIBOR_3M: 'FM/M.U2.EUR.RT.MM.EURIBOR3MD_.HSTA',
  EUR_USD: 'EXR/M.USD.EUR.SP00.A',
  MORTGAGE_RATE_IE: 'MIR/M.IE.B.A2A.A.R.A.2250.EUR.N',
}

// World Bank Indicators
export const WB_INDICATORS = {
  GDP_GROWTH: 'NY.GDP.MKTP.KD.ZG',
  INFLATION: 'FP.CPI.TOTL.ZG',
  UNEMPLOYMENT: 'SL.UEM.TOTL.ZS',
  TRADE_PCT_GDP: 'NE.TRD.GNFS.ZS',
}

// Source colors for badges and charts
export const SOURCE_COLORS = {
  cso: { bg: 'bg-sky-100', text: 'text-sky-800', chart: '#0ea5e9' },
  ecb: { bg: 'bg-amber-100', text: 'text-amber-800', chart: '#f59e0b' },
  eurostat: { bg: 'bg-indigo-100', text: 'text-indigo-800', chart: '#6366f1' },
  oecd: { bg: 'bg-emerald-100', text: 'text-emerald-800', chart: '#10b981' },
  worldbank: { bg: 'bg-rose-100', text: 'text-rose-800', chart: '#f43f5e' },
  cbi: { bg: 'bg-cyan-100', text: 'text-cyan-800', chart: '#06b6d4' },
  dof: { bg: 'bg-green-100', text: 'text-green-800', chart: '#22c55e' },
  wto: { bg: 'bg-blue-100', text: 'text-blue-800', chart: '#3b82f6' },
  imf: { bg: 'bg-amber-100', text: 'text-amber-800', chart: '#f59e0b' },
  eu_trade: { bg: 'bg-indigo-100', text: 'text-indigo-800', chart: '#6366f1' },
  usitc: { bg: 'bg-red-100', text: 'text-red-800', chart: '#ef4444' },
  mofcom: { bg: 'bg-orange-100', text: 'text-orange-800', chart: '#f97316' },
}

// Chart color palette
export const CHART_COLORS = [
  '#334155', '#0ea5e9', '#f59e0b', '#6366f1',
  '#10b981', '#f43f5e', '#8b5cf6', '#06b6d4',
]

// Countdown events
export const COUNTDOWN_EVENTS = [
  { title: 'Local & European Elections', targetDate: '2027-11-01' },
  { title: 'General Election', targetDate: '2029-11-17' },
  { title: 'Budget 2027', targetDate: '2026-10-13' },
  { title: 'ECB Next Meeting', targetDate: '2026-04-17' },
  { title: 'CSO GDP Release', targetDate: '2026-06-26' },
  { title: 'OECD Economic Outlook', targetDate: '2026-06-10' },
  { title: 'EU Summit', targetDate: '2026-06-25' },
  { title: 'IMF World Economic Outlook', targetDate: '2026-10-01' },
]

// Sample reports data
export const LATEST_REPORTS = [
  {
    title: 'Quarterly National Accounts Q4 2025',
    source: 'cso',
    url: 'https://www.cso.ie/en/releasesandpublications/ep/p-na/qna/',
    published_date: '2026-03-13',
    summary_points: [
      'GDP grew by 2.1% in Q4 2025 compared to the previous quarter',
      'Modified domestic demand increased by 1.8% year-on-year',
    ],
    category: 'statistics',
  },
  {
    title: 'Quarterly Bulletin Q1 2026',
    source: 'cbi',
    url: 'https://www.centralbank.ie/publication/quarterly-bulletins',
    published_date: '2026-03-10',
    summary_points: [
      'Irish economy continues to show resilience despite global headwinds',
      'Inflation projected to moderate to 2.3% by year end',
    ],
    category: 'economic_outlook',
  },
  {
    title: 'Stability Programme Update',
    source: 'dof',
    url: 'https://www.gov.ie/en/collection/budget/',
    published_date: '2026-03-05',
    summary_points: [
      'Government projects surplus of 1.2% of GDP for 2026',
      'Continued investment in housing and infrastructure planned',
    ],
    category: 'fiscal_policy',
  },
  {
    title: 'OECD Economic Survey of Ireland 2026',
    source: 'oecd',
    url: 'https://www.oecd.org/ireland/',
    published_date: '2026-02-28',
    summary_points: [
      'Recommends broadening the tax base and reducing reliance on corporation tax',
      'Highlights housing supply as a key challenge for growth',
    ],
    category: 'economic_outlook',
  },
]

export const TRADE_REPORTS = [
  {
    title: 'World Trade Outlook Indicator',
    source: 'wto',
    url: 'https://www.wto.org/english/news_e/news_e.htm',
    published_date: '2026-03-01',
    summary_points: [
      'Global goods trade volume grew 2.7% in 2025',
      'Services trade continues post-pandemic recovery',
    ],
    category: 'global_trade',
  },
  {
    title: 'World Economic Outlook Update',
    source: 'imf',
    url: 'https://www.imf.org/en/Publications/WEO',
    published_date: '2026-01-20',
    summary_points: [
      'Global growth projected at 3.3% for 2026',
      'Trade policy uncertainty remains elevated',
    ],
    category: 'economic_impact',
  },
  {
    title: 'EU Trade Policy Review',
    source: 'eu_trade',
    url: 'https://policy.trade.ec.europa.eu/',
    published_date: '2026-02-15',
    summary_points: [
      'EU-Mercosur trade agreement implementation progressing',
      'New trade defence measures under consideration',
    ],
    category: 'trade_policy',
  },
]

export const HOUSING_REPORTS = [
  {
    title: 'Residential Property Price Index February 2026',
    source: 'cso',
    url: 'https://www.cso.ie/en/releasesandpublications/ep/p-rppi/residentialpropertypriceindex/',
    published_date: '2026-03-14',
    summary_points: [
      'National house prices increased by 6.2% year-on-year',
      'Dublin prices up 5.8%, prices outside Dublin up 6.7%',
    ],
    category: 'statistics',
  },
  {
    title: 'Financial Stability Review 2026:I',
    source: 'cbi',
    url: 'https://www.centralbank.ie/publication/financial-stability-review',
    published_date: '2026-03-01',
    summary_points: [
      'Mortgage lending rules remain appropriate for current conditions',
      'Commercial real estate risks are being closely monitored',
    ],
    category: 'research',
  },
]

// Shared house price index data
export const HOUSE_PRICE_INDEX_DATA = [
  { period: '2020', value: 100 },
  { period: '2021', value: 108 },
  { period: '2022', value: 121 },
  { period: '2023', value: 128 },
  { period: '2024', value: 136 },
  { period: '2025', value: 143 },
]

// Reusable chart styling constants (avoid inline object allocation on every render)
export const CHART_AXIS_TICK = { fontSize: 12 }
export const CHART_AXIS_STROKE = '#94a3b8'
export const CHART_GRID_STROKE = '#e2e8f0'

// Data sources for status page
export const DATA_SOURCES = [
  { name: 'Central Statistics Office', provider: 'cso', endpoint: API_URLS.CSO, frequency: 'monthly' },
  { name: 'European Central Bank', provider: 'ecb', endpoint: API_URLS.ECB, frequency: 'daily' },
  { name: 'Eurostat', provider: 'eurostat', endpoint: API_URLS.EUROSTAT, frequency: 'monthly' },
  { name: 'OECD', provider: 'oecd', endpoint: API_URLS.OECD, frequency: 'quarterly' },
  { name: 'World Bank', provider: 'worldbank', endpoint: API_URLS.WORLD_BANK, frequency: 'yearly' },
  { name: 'Central Bank of Ireland', provider: 'cbi', endpoint: 'https://www.centralbank.ie', frequency: 'quarterly' },
]
