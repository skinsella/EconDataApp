import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  Database,
  Calendar,
  Home as HomeIcon,
  Globe,
  Newspaper,
  BarChart3,
  Menu,
  X,
} from 'lucide-react'
import { useState, useEffect } from 'react'

const navigation = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Economic Overview', path: '/irish-economy', icon: TrendingUp },
  { name: 'Latest Reports', path: '/latest-reports', icon: FileText },
  { name: 'Trade Reports', path: '/trade-reports', icon: Globe },
  { name: 'Housing Reports', path: '/housing', icon: HomeIcon },
  { name: 'Media Sentiment', path: '/media-sentiment', icon: Newspaper },
  { name: 'Days Until', path: '/days-until', icon: Calendar },
  { name: 'Data Sources', path: '/data-sources', icon: Database },
]

export default function Sidebar() {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-slate-900 text-white md:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col shrink-0
          transform transition-transform duration-200 ease-in-out
          md:static md:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-sky-400" />
            <div>
              <h1 className="text-lg font-bold text-white">Econ Dashboard</h1>
              <p className="text-xs text-slate-400">Irish Economic Data</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-white md:hidden"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Main navigation">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.name}
                to={item.path}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <p className="text-xs text-slate-500 text-center">
            Econ Dashboard {new Date().getFullYear()}
          </p>
        </div>
      </aside>
    </>
  )
}
