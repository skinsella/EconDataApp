import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { DataSourceCard } from '@/components/DataSourceCard'
import { DATA_SOURCES } from '@/lib/constants'

const sourcesWithStatus = DATA_SOURCES.map((s) => ({ ...s, status: 'ok' }))

const activeCount = sourcesWithStatus.filter((s) => s.status === 'ok').length
const degradedCount = sourcesWithStatus.filter((s) => s.status === 'degraded').length
const downCount = sourcesWithStatus.filter((s) => s.status === 'down').length

export default function DataSources() {
  return (
    <motion.div
      className="p-8 space-y-8 overflow-y-auto h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Data Sources</h1>
        <p className="text-slate-500 mt-1">Status of connected economic data providers</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-emerald-500" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{activeCount}</p>
              <p className="text-sm text-slate-500">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-amber-500" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{degradedCount}</p>
              <p className="text-sm text-slate-500">Degraded</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <XCircle className="h-6 w-6 text-red-500" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{downCount}</p>
              <p className="text-sm text-slate-500">Down</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sourcesWithStatus.map((source) => (
          <DataSourceCard key={source.provider} source={source} />
        ))}
      </div>
    </motion.div>
  )
}
