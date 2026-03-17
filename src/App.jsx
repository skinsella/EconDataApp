import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Skeleton } from './components/ui/skeleton'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const IrishEconomy = lazy(() => import('./pages/IrishEconomy'))
const LatestReports = lazy(() => import('./pages/LatestReports'))
const TradeReports = lazy(() => import('./pages/TradeReports'))
const HousingReports = lazy(() => import('./pages/HousingReports'))
const MediaSentiment = lazy(() => import('./pages/MediaSentiment'))
const DaysUntil = lazy(() => import('./pages/DaysUntil'))
const DataSources = lazy(() => import('./pages/DataSources'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageFallback() {
  return (
    <div className="p-8 space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <ErrorBoundary>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/irish-economy" element={<IrishEconomy />} />
              <Route path="/latest-reports" element={<LatestReports />} />
              <Route path="/trade-reports" element={<TradeReports />} />
              <Route path="/housing" element={<HousingReports />} />
              <Route path="/media-sentiment" element={<MediaSentiment />} />
              <Route path="/days-until" element={<DaysUntil />} />
              <Route path="/data-sources" element={<DataSources />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Layout>
    </HashRouter>
  )
}
