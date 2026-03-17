import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import IrishEconomy from './pages/IrishEconomy'
import Benchmarks from './pages/Benchmarks'
import PublicFinances from './pages/PublicFinances'
import Structural from './pages/Structural'
import LatestReports from './pages/LatestReports'
import TradeReports from './pages/TradeReports'
import HousingReports from './pages/HousingReports'
import CSOReleases from './pages/CSOReleases'
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
          <Route path="/benchmarks" element={<Benchmarks />} />
          <Route path="/public-finances" element={<PublicFinances />} />
          <Route path="/structural" element={<Structural />} />
          <Route path="/latest-reports" element={<LatestReports />} />
          <Route path="/trade-reports" element={<TradeReports />} />
          <Route path="/housing" element={<HousingReports />} />
          <Route path="/cso-releases" element={<CSOReleases />} />
          <Route path="/days-until" element={<DaysUntil />} />
          <Route path="/data-sources" element={<DataSources />} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}
