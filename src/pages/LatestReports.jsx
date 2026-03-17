import { useState } from 'react'
import { ReportCard } from '@/components/ReportCard'
import { PageWrapper } from '@/components/PageWrapper'
import { LATEST_REPORTS } from '@/lib/constants'

const filters = ['All', 'cso', 'cbi', 'dof', 'oecd']
const filterLabels = { All: 'All', cso: 'CSO', cbi: 'CBI', dof: 'DoF', oecd: 'OECD' }

export default function LatestReports() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filteredReports =
    activeFilter === 'All'
      ? LATEST_REPORTS
      : LATEST_REPORTS.filter((r) => r.source === activeFilter)

  return (
    <PageWrapper title="Latest Reports">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Latest Reports</h1>
        <p className="text-slate-500 mt-1">Recent economic publications and analysis</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Filter reports by source">
        {filters.map((f) => (
          <button
            key={f}
            aria-pressed={activeFilter === f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === f
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {filterLabels[f]}
          </button>
        ))}
        <span className="ml-auto text-sm text-slate-500">
          {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredReports.map((report) => (
          <ReportCard key={report.title} report={report} />
        ))}
      </div>
    </PageWrapper>
  )
}
