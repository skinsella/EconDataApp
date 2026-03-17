import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import { ThumbsUp, Minus, ThumbsDown, Info } from 'lucide-react'
import { KpiCard } from '@/components/KpiCard'
import { ChartCard } from '@/components/ChartCard'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const sentimentBarData = [
  { name: 'Positive', value: 42 },
  { name: 'Neutral', value: 38 },
  { name: 'Negative', value: 20 },
]

const barColors = ['#10b981', '#64748b', '#ef4444']

const headlines = [
  { text: 'Irish GDP growth exceeds expectations in Q4 2025', sentiment: 'positive' },
  { text: 'ECB holds interest rates steady at March meeting', sentiment: 'neutral' },
  { text: 'Housing completions rise 12% year-on-year', sentiment: 'positive' },
  { text: 'Consumer confidence index falls for second month', sentiment: 'negative' },
  { text: 'FDI inflows remain robust despite global uncertainty', sentiment: 'positive' },
  { text: 'Government announces new infrastructure spending package', sentiment: 'neutral' },
  { text: 'Retail sales growth slows in February', sentiment: 'negative' },
  { text: 'Tech sector employment continues to expand', sentiment: 'positive' },
  { text: 'OECD revises Ireland growth forecast marginally lower', sentiment: 'neutral' },
  { text: 'Cost of living pressures persist in urban areas', sentiment: 'negative' },
]

const sentimentBadge = {
  positive: 'bg-emerald-100 text-emerald-700',
  neutral: 'bg-slate-100 text-slate-700',
  negative: 'bg-red-100 text-red-700',
}

export default function MediaSentiment() {
  return (
    <motion.div
      className="p-8 space-y-8 overflow-y-auto h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Media Sentiment</h1>
        <p className="text-slate-500 mt-1">Sentiment analysis of Irish economic news coverage</p>
      </div>

      <Card className="border-sky-200 bg-sky-50">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-sky-600 mt-0.5 shrink-0" />
          <p className="text-sm text-sky-800">
            This page shows automated sentiment analysis of recent Irish economic news headlines.
            Sentiment is classified as positive, neutral, or negative based on natural language processing.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard title="Positive" value="42%" subtitle="of headlines" icon={ThumbsUp} color="emerald" />
        <KpiCard title="Neutral" value="38%" subtitle="of headlines" icon={Minus} color="slate" />
        <KpiCard title="Negative" value="20%" subtitle="of headlines" icon={ThumbsDown} color="red" />
      </div>

      <ChartCard title="Sentiment Distribution" subtitle="Percentage of analysed headlines">
        <BarChart data={sentimentBarData} layout="vertical">
          <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" domain={[0, 100]} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" width={70} />
          <Tooltip formatter={(val) => `${val}%`} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {sentimentBarData.map((entry, index) => (
              <Cell key={entry.name} fill={barColors[index]} />
            ))}
          </Bar>
        </BarChart>
      </ChartCard>

      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Headlines</h2>
        <div className="space-y-3">
          {headlines.map((h, i) => (
            <Card key={i}>
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <p className="text-sm text-slate-700">{h.text}</p>
                <Badge className={`${sentimentBadge[h.sentiment]} shrink-0 capitalize`}>
                  {h.sentiment}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
