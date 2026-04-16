// ──────────────────────────────────────────────────────────────────────
// Energy Crisis Policy Response Tracker
//
// Inspired by the IEA "Energy Crisis Policy Response Tracker".
// Coverage prioritises EU-27 member states with selected non-EU
// comparators (UK, Norway, Switzerland) at the bottom.
//
// Data here should be treated as a SEED set. Each measure carries a
// `source_url` pointing to a primary government / EU institution page
// for verification. Extend by adding entries to the `measures` array
// for each country.
//
// Categories follow the IEA two-pillar split:
//   1. Energy Conservation Measures
//   2. Consumer Support Measures
// ──────────────────────────────────────────────────────────────────────

export const POLICY_CATEGORIES = {
  conservation: {
    id: 'conservation',
    label: 'Energy Conservation',
    short: 'Conservation',
    color: { bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-500' },
    subcategories: [
      { id: 'heating_limits',   label: 'Heating temperature limits' },
      { id: 'cooling_limits',   label: 'Cooling temperature limits' },
      { id: 'lighting',         label: 'Lighting / illuminated signs' },
      { id: 'public_buildings', label: 'Public-building rules' },
      { id: 'campaigns',        label: 'Public information campaigns' },
      { id: 'transport',        label: 'Transport / mobility' },
      { id: 'demand_target',    label: 'Demand-reduction targets' },
    ],
  },
  support: {
    id: 'support',
    label: 'Consumer Support',
    short: 'Support',
    color: { bg: 'bg-sky-100', text: 'text-sky-800', dot: 'bg-sky-500' },
    subcategories: [
      { id: 'price_caps',      label: 'Price caps / regulated tariffs' },
      { id: 'tax_cuts',        label: 'VAT / excise reductions' },
      { id: 'household_grant', label: 'Household grants / vouchers' },
      { id: 'business_grant',  label: 'Business / industry support' },
      { id: 'vulnerable',      label: 'Targeted vulnerable households' },
      { id: 'windfall_tax',    label: 'Windfall / solidarity levy' },
    ],
  },
}

// Helper for status badges on individual measures
export const POLICY_STATUS = {
  active:    { label: 'Active',    bg: 'bg-emerald-100', text: 'text-emerald-800' },
  expired:   { label: 'Expired',   bg: 'bg-slate-100',   text: 'text-slate-700' },
  announced: { label: 'Announced', bg: 'bg-amber-100',   text: 'text-amber-800' },
  extended:  { label: 'Extended',  bg: 'bg-indigo-100',  text: 'text-indigo-800' },
}

// EU-27 plus comparators. Order: EU first (alpha), then non-EU.
// `seed` flags whether we have any populated measures; the UI uses this
// to highlight scaffolded-but-empty rows.
export const COUNTRIES = [
  { iso: 'AT', name: 'Austria',        region: 'EU' },
  { iso: 'BE', name: 'Belgium',        region: 'EU' },
  { iso: 'BG', name: 'Bulgaria',       region: 'EU' },
  { iso: 'HR', name: 'Croatia',        region: 'EU' },
  { iso: 'CY', name: 'Cyprus',         region: 'EU' },
  { iso: 'CZ', name: 'Czechia',        region: 'EU' },
  { iso: 'DK', name: 'Denmark',        region: 'EU' },
  { iso: 'EE', name: 'Estonia',        region: 'EU' },
  { iso: 'FI', name: 'Finland',        region: 'EU' },
  { iso: 'FR', name: 'France',         region: 'EU' },
  { iso: 'DE', name: 'Germany',        region: 'EU' },
  { iso: 'GR', name: 'Greece',         region: 'EU' },
  { iso: 'HU', name: 'Hungary',        region: 'EU' },
  { iso: 'IE', name: 'Ireland',        region: 'EU' },
  { iso: 'IT', name: 'Italy',          region: 'EU' },
  { iso: 'LV', name: 'Latvia',         region: 'EU' },
  { iso: 'LT', name: 'Lithuania',      region: 'EU' },
  { iso: 'LU', name: 'Luxembourg',     region: 'EU' },
  { iso: 'MT', name: 'Malta',          region: 'EU' },
  { iso: 'NL', name: 'Netherlands',    region: 'EU' },
  { iso: 'PL', name: 'Poland',         region: 'EU' },
  { iso: 'PT', name: 'Portugal',       region: 'EU' },
  { iso: 'RO', name: 'Romania',        region: 'EU' },
  { iso: 'SK', name: 'Slovakia',       region: 'EU' },
  { iso: 'SI', name: 'Slovenia',       region: 'EU' },
  { iso: 'ES', name: 'Spain',          region: 'EU' },
  { iso: 'SE', name: 'Sweden',         region: 'EU' },
  // Comparators
  { iso: 'GB', name: 'United Kingdom', region: 'Non-EU' },
  { iso: 'NO', name: 'Norway',         region: 'Non-EU' },
  { iso: 'CH', name: 'Switzerland',    region: 'Non-EU' },
]

// ──────────────────────────────────────────────────────────────────────
// MEASURES
//
// Schema:
//   country:      ISO-2 (matches COUNTRIES)
//   category:     'conservation' | 'support'
//   subcategory:  one of the ids in POLICY_CATEGORIES[*].subcategories
//   title:        short headline of the measure
//   description:  1-3 sentences, factual and neutral
//   announced:    YYYY-MM-DD (announcement / first effective date)
//   status:       'active' | 'expired' | 'announced' | 'extended'
//   source_url:   primary government or EU institution page
//   source_label: short label shown on the link
//
// NOTE: Seed entries below are limited to measures that are widely
// documented in primary sources. Extend cautiously — verify before
// adding details that could be wrong (cap levels, exact end dates).
// ──────────────────────────────────────────────────────────────────────
export const MEASURES = [
  // ── EU-level (cross-cutting framework) ─────────────────────────────
  // Tagged as 'EU' country so it can be filtered separately in the UI.
  // ────────────────────────────────────────────────────────────────────

  // ── Ireland ────────────────────────────────────────────────────────
  {
    country: 'IE',
    category: 'support',
    subcategory: 'household_grant',
    title: 'Electricity Costs Emergency Benefit Scheme',
    description: 'Universal credits applied to all domestic electricity accounts across successive winters since 2022, administered via electricity suppliers.',
    announced: '2022-02-10',
    status: 'extended',
    source_url: 'https://www.gov.ie/en/publication/electricity-costs-emergency-benefit-scheme/',
    source_label: 'gov.ie',
  },
  {
    country: 'IE',
    category: 'support',
    subcategory: 'tax_cuts',
    title: 'Reduced VAT on gas and electricity (9%)',
    description: 'VAT rate on supply of gas and electricity reduced from 13.5% to 9%, repeatedly extended in subsequent finance bills.',
    announced: '2022-05-01',
    status: 'extended',
    source_url: 'https://www.revenue.ie/en/vat/vat-rates/',
    source_label: 'revenue.ie',
  },
  {
    country: 'IE',
    category: 'support',
    subcategory: 'vulnerable',
    title: 'Fuel Allowance enhancement',
    description: 'Lump-sum top-ups and widened eligibility for the Fuel Allowance announced in successive budgets to support low-income households.',
    announced: '2022-09-27',
    status: 'extended',
    source_url: 'https://www.gov.ie/en/service/00aa38-fuel-allowance/',
    source_label: 'gov.ie',
  },

  // ── Germany ────────────────────────────────────────────────────────
  {
    country: 'DE',
    category: 'support',
    subcategory: 'price_caps',
    title: 'Strompreisbremse (Electricity price brake)',
    description: 'Cap on the working price of electricity for a baseline share of prior consumption for households and SMEs; surcharge above the cap.',
    announced: '2022-12-15',
    status: 'expired',
    source_url: 'https://www.bundesregierung.de/breg-de/themen/entlastung-fuer-deutschland/strompreisbremse-2125202',
    source_label: 'bundesregierung.de',
  },
  {
    country: 'DE',
    category: 'support',
    subcategory: 'price_caps',
    title: 'Gaspreisbremse (Gas price brake)',
    description: 'Capped price for natural gas and district heating on a baseline share of prior consumption; difference funded from the federal Wirtschaftsstabilisierungsfonds.',
    announced: '2022-12-15',
    status: 'expired',
    source_url: 'https://www.bundesregierung.de/breg-de/themen/entlastung-fuer-deutschland/gaspreisbremse-2125198',
    source_label: 'bundesregierung.de',
  },
  {
    country: 'DE',
    category: 'conservation',
    subcategory: 'public_buildings',
    title: 'EnSikuMaV: heating limits in public buildings',
    description: 'Short-term energy savings ordinance capping heating in public office buildings at 19°C, banning heating of corridors/foyers and restricting illuminated advertising.',
    announced: '2022-09-01',
    status: 'expired',
    source_url: 'https://www.gesetze-im-internet.de/ensikumav/',
    source_label: 'gesetze-im-internet.de',
  },

  // ── France ─────────────────────────────────────────────────────────
  {
    country: 'FR',
    category: 'support',
    subcategory: 'price_caps',
    title: 'Bouclier tarifaire (Tariff shield)',
    description: 'Caps annual increases in regulated gas and electricity tariffs for households; cost borne by the state budget. Phased down from 2024.',
    announced: '2021-09-30',
    status: 'extended',
    source_url: 'https://www.economie.gouv.fr/particuliers/bouclier-tarifaire',
    source_label: 'economie.gouv.fr',
  },
  {
    country: 'FR',
    category: 'support',
    subcategory: 'household_grant',
    title: 'Chèque énergie',
    description: 'Means-tested annual energy voucher posted to eligible households, used to pay energy bills or fund retrofit works.',
    announced: '2018-01-01',
    status: 'active',
    source_url: 'https://chequeenergie.gouv.fr/',
    source_label: 'chequeenergie.gouv.fr',
  },
  {
    country: 'FR',
    category: 'conservation',
    subcategory: 'campaigns',
    title: 'Plan de sobriété énergétique',
    description: 'National energy-sobriety plan with sectoral targets, public-building 19°C heating limit, lighting curfews and an "EcoWatt" demand-signal app.',
    announced: '2022-10-06',
    status: 'active',
    source_url: 'https://www.ecologie.gouv.fr/plan-sobriete-energetique',
    source_label: 'ecologie.gouv.fr',
  },

  // ── Spain ──────────────────────────────────────────────────────────
  {
    country: 'ES',
    category: 'support',
    subcategory: 'price_caps',
    title: 'Iberian exception (gas-price cap on power)',
    description: 'Joint Spain-Portugal mechanism capping the price of gas used for electricity generation in the wholesale market, lowering the marginal clearing price.',
    announced: '2022-06-14',
    status: 'expired',
    source_url: 'https://www.miteco.gob.es/es/prensa/ultimas-noticias/2022/06/excepcion-iberica.aspx',
    source_label: 'miteco.gob.es',
  },
  {
    country: 'ES',
    category: 'support',
    subcategory: 'tax_cuts',
    title: 'Reduced VAT on electricity and gas',
    description: 'VAT on electricity supply reduced (initially to 5%) and on natural gas to 5%, with subsequent gradual reversion as wholesale prices fell.',
    announced: '2021-06-26',
    status: 'expired',
    source_url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2021-10523',
    source_label: 'boe.es',
  },
  {
    country: 'ES',
    category: 'conservation',
    subcategory: 'cooling_limits',
    title: 'RD-Ley 14/2022: A/C and heating limits',
    description: 'Royal Decree-Law setting cooling no lower than 27°C and heating no higher than 19°C in workplaces, shops, hotels and transport hubs, plus illuminated-window switch-off after 22:00.',
    announced: '2022-08-01',
    status: 'expired',
    source_url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2022-12925',
    source_label: 'boe.es',
  },

  // ── Italy ──────────────────────────────────────────────────────────
  {
    country: 'IT',
    category: 'support',
    subcategory: 'vulnerable',
    title: 'Bonus sociale elettrico e gas',
    description: 'Automatic discount on electricity and gas bills for low-income households (ISEE threshold), with thresholds raised during the crisis.',
    announced: '2021-09-27',
    status: 'extended',
    source_url: 'https://www.arera.it/bonus-sociale',
    source_label: 'arera.it',
  },
  {
    country: 'IT',
    category: 'support',
    subcategory: 'windfall_tax',
    title: 'Contributo straordinario sugli extraprofitti energetici',
    description: 'Solidarity contribution on extra profits of energy producers, importers and resellers, applied to the increase in VAT taxable base.',
    announced: '2022-03-21',
    status: 'expired',
    source_url: 'https://www.agenziaentrate.gov.it/portale/contributo-extraprofitti',
    source_label: 'agenziaentrate.gov.it',
  },
  {
    country: 'IT',
    category: 'conservation',
    subcategory: 'heating_limits',
    title: 'Heating-season cap (1°C lower, shorter)',
    description: 'Decree by MITE reducing the maximum indoor temperature in residential and most non-residential buildings by 1°C and shortening the heating season by 15 days.',
    announced: '2022-10-06',
    status: 'expired',
    source_url: 'https://www.mase.gov.it/comunicati/decreto-riscaldamento',
    source_label: 'mase.gov.it',
  },

  // ── Netherlands ────────────────────────────────────────────────────
  {
    country: 'NL',
    category: 'support',
    subcategory: 'price_caps',
    title: 'Prijsplafond energie (Energy price cap)',
    description: 'Capped tariffs for electricity and gas up to a baseline annual consumption volume, applied via suppliers and reimbursed by the state for 2023.',
    announced: '2022-10-04',
    status: 'expired',
    source_url: 'https://www.rijksoverheid.nl/onderwerpen/koopkracht/prijsplafond-voor-gas-en-elektriciteit',
    source_label: 'rijksoverheid.nl',
  },
  {
    country: 'NL',
    category: 'support',
    subcategory: 'household_grant',
    title: 'Energietoeslag (one-off energy allowance)',
    description: 'Lump-sum allowance for low-income households, paid via municipalities (€800 in 2022, €1,300 in 2023).',
    announced: '2022-03-15',
    status: 'expired',
    source_url: 'https://www.rijksoverheid.nl/onderwerpen/koopkracht/energietoeslag',
    source_label: 'rijksoverheid.nl',
  },

  // ── Belgium ────────────────────────────────────────────────────────
  {
    country: 'BE',
    category: 'support',
    subcategory: 'vulnerable',
    title: 'Extended social tariff for energy',
    description: 'Temporary expansion of the federal "tarif social" for electricity and gas to roughly one million additional households, then phased back to standard eligibility.',
    announced: '2021-02-01',
    status: 'expired',
    source_url: 'https://economie.fgov.be/fr/themes/energie/tarif-social',
    source_label: 'economie.fgov.be',
  },
  {
    country: 'BE',
    category: 'support',
    subcategory: 'tax_cuts',
    title: 'Reduced VAT on electricity, gas and heat (6%)',
    description: 'VAT on residential electricity, natural gas and district heating reduced to 6%; subsequently made structural alongside an excise reform.',
    announced: '2022-03-01',
    status: 'active',
    source_url: 'https://finance.belgium.be/fr/particuliers/famille/energie',
    source_label: 'finance.belgium.be',
  },

  // ── Austria ────────────────────────────────────────────────────────
  {
    country: 'AT',
    category: 'support',
    subcategory: 'price_caps',
    title: 'Stromkostenbremse',
    description: 'Subsidised electricity price for the first 2,900 kWh of annual household consumption, with the state covering the difference up to a reference price.',
    announced: '2022-12-01',
    status: 'expired',
    source_url: 'https://www.stromkostenbremse.gv.at/',
    source_label: 'stromkostenbremse.gv.at',
  },

  // ── Portugal ───────────────────────────────────────────────────────
  {
    country: 'PT',
    category: 'support',
    subcategory: 'price_caps',
    title: 'Iberian exception (gas-price cap on power)',
    description: 'Joint Portugal-Spain mechanism capping the gas price used for power generation, applied through the MIBEL wholesale market.',
    announced: '2022-06-14',
    status: 'expired',
    source_url: 'https://www.dgeg.gov.pt/',
    source_label: 'dgeg.gov.pt',
  },

  // ── Greece ─────────────────────────────────────────────────────────
  {
    country: 'GR',
    category: 'support',
    subcategory: 'household_grant',
    title: 'Power Pass / electricity bill subsidy',
    description: 'Retroactive subsidy crediting a share of the previous months\' wholesale-driven price increases back to household electricity accounts.',
    announced: '2022-06-01',
    status: 'expired',
    source_url: 'https://powerpass.gov.gr/',
    source_label: 'powerpass.gov.gr',
  },

  // ── Poland ─────────────────────────────────────────────────────────
  {
    country: 'PL',
    category: 'support',
    subcategory: 'price_caps',
    title: 'Frozen electricity tariffs up to consumption cap',
    description: 'Households charged 2022 reference prices on electricity up to a baseline annual volume (raised for large families, disabled and farm households).',
    announced: '2022-10-27',
    status: 'expired',
    source_url: 'https://www.gov.pl/web/klimat/tarcza-solidarnosciowa',
    source_label: 'gov.pl',
  },
  {
    country: 'PL',
    category: 'support',
    subcategory: 'household_grant',
    title: 'Dodatek węglowy (Coal allowance)',
    description: 'One-off PLN 3,000 allowance for households whose main heat source is coal, administered by municipalities.',
    announced: '2022-08-12',
    status: 'expired',
    source_url: 'https://www.gov.pl/web/klimat/dodatek-weglowy',
    source_label: 'gov.pl',
  },

  // ── Czechia ────────────────────────────────────────────────────────
  {
    country: 'CZ',
    category: 'support',
    subcategory: 'price_caps',
    title: 'Capped electricity and gas prices',
    description: 'Government decree capping electricity at CZK 6,050/MWh and gas at CZK 3,025/MWh (incl. VAT) for households and SMEs up to a baseline consumption.',
    announced: '2022-10-05',
    status: 'expired',
    source_url: 'https://www.mpo.gov.cz/cz/energetika/strop-cen-energii/',
    source_label: 'mpo.gov.cz',
  },

  // ── Sweden ─────────────────────────────────────────────────────────
  {
    country: 'SE',
    category: 'support',
    subcategory: 'household_grant',
    title: 'High-cost protection (elprisstöd)',
    description: 'Retroactive electricity-cost compensation paid via Försäkringskassan to households and businesses in the price areas with highest spot prices.',
    announced: '2022-12-15',
    status: 'expired',
    source_url: 'https://www.regeringen.se/pressmeddelanden/2022/12/elprisstodet-ar-pa-vag/',
    source_label: 'regeringen.se',
  },

  // ── Denmark ────────────────────────────────────────────────────────
  {
    country: 'DK',
    category: 'support',
    subcategory: 'household_grant',
    title: 'Varmecheck (Heating cheque)',
    description: 'One-off DKK 6,000 heating allowance for households with high heating costs and incomes below a defined threshold.',
    announced: '2022-02-01',
    status: 'expired',
    source_url: 'https://www.borger.dk/oekonomi-skat-su/Varmecheck',
    source_label: 'borger.dk',
  },

  // ── Finland ────────────────────────────────────────────────────────
  {
    country: 'FI',
    category: 'conservation',
    subcategory: 'campaigns',
    title: 'Astetta alemmas (One degree lower)',
    description: 'National energy-saving campaign coordinated by Motiva and government ministries, encouraging a 1°C reduction in indoor temperature and shorter showers.',
    announced: '2022-10-10',
    status: 'active',
    source_url: 'https://astettaalemmas.fi/',
    source_label: 'astettaalemmas.fi',
  },

  // ── EU level (UK / non-EU comparators) ─────────────────────────────
  {
    country: 'GB',
    category: 'support',
    subcategory: 'price_caps',
    title: 'Energy Price Guarantee (EPG)',
    description: 'Cap on per-unit gas and electricity charges for typical household dual-fuel bills, with the difference reimbursed to suppliers from HM Treasury.',
    announced: '2022-09-08',
    status: 'expired',
    source_url: 'https://www.gov.uk/government/publications/energy-bills-support/energy-bills-support-factsheet-8-september-2022',
    source_label: 'gov.uk',
  },
  {
    country: 'GB',
    category: 'support',
    subcategory: 'household_grant',
    title: 'Energy Bills Support Scheme (£400)',
    description: 'Non-repayable £400 discount on domestic electricity bills delivered in six monthly instalments over winter 2022-23.',
    announced: '2022-05-26',
    status: 'expired',
    source_url: 'https://www.gov.uk/government/publications/energy-bills-support-scheme-explainer',
    source_label: 'gov.uk',
  },
  {
    country: 'GB',
    category: 'support',
    subcategory: 'windfall_tax',
    title: 'Energy Profits Levy',
    description: 'Temporary additional surcharge on the profits of UK oil and gas producers, with subsequent rate increases and extension of the sunset date.',
    announced: '2022-05-26',
    status: 'extended',
    source_url: 'https://www.gov.uk/government/publications/energy-taxes-factsheet',
    source_label: 'gov.uk',
  },
]

// Convenience helpers consumed by the page component ────────────────
export function getMeasuresByCountry(iso) {
  return MEASURES.filter(m => m.country === iso)
}

export function getCountriesWithCounts() {
  const counts = MEASURES.reduce((acc, m) => {
    acc[m.country] = (acc[m.country] || 0) + 1
    return acc
  }, {})
  return COUNTRIES.map(c => ({ ...c, measureCount: counts[c.iso] || 0 }))
}
