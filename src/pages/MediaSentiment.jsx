import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

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

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-6 flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-sm text-amber-800 space-y-2">
            <p className="font-medium">This page is under development.</p>
            <p>
              Automated sentiment analysis requires a live news feed and NLP pipeline.
              This feature is planned for a future release. In the meantime, you can
              follow Irish economic news coverage from these sources:
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {NEWS_SOURCES.map((source) => (
          <Card key={source.name}>
            <CardContent className="p-5">
              <h3 className="font-semibold text-slate-900">{source.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{source.description}</p>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm font-medium text-sky-600 hover:text-sky-700"
              >
                Visit &rarr;
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  )
}

const NEWS_SOURCES = [
  {
    name: 'RTE Business',
    url: 'https://www.rte.ie/news/business/',
    description: 'Irish national broadcaster business and economy reporting.',
  },
  {
    name: 'Irish Times Business',
    url: 'https://www.irishtimes.com/business/',
    description: 'Business news, economic analysis and market data.',
  },
  {
    name: 'Business Post',
    url: 'https://www.businesspost.ie/',
    description: 'In-depth Irish business and economic journalism.',
  },
  {
    name: 'Irish Examiner Business',
    url: 'https://www.irishexaminer.com/business/',
    description: 'Business reporting with a focus on regional and national economy.',
  },
  {
    name: 'Central Bank Blog',
    url: 'https://www.centralbank.ie/news/article/behind-the-data',
    description: 'Behind the Data blog posts from CBI economists.',
  },
  {
    name: 'ESRI Publications',
    url: 'https://www.esri.ie/publications',
    description: 'Economic and Social Research Institute research papers and commentary.',
  },
]
