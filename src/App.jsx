import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import IrishEconomy from './pages/IrishEconomy'
import LatestReports from './pages/LatestReports'
import TradeReports from './pages/TradeReports'
import HousingReports from './pages/HousingReports'
import MediaSentiment from './pages/MediaSentiment'
import DaysUntil from './pages/DaysUntil'
import DataSources from './pages/DataSources'

export default function App() {
  return (
    <HashRouter>
      <Layout>
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
        </Routes>
      </Layout>
    </HashRouter>
  )
}
