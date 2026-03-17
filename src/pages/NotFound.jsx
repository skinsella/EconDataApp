import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-full p-8">
      <Card className="max-w-md w-full">
        <CardContent className="p-6 text-center space-y-3">
          <p className="text-5xl font-bold text-slate-300">404</p>
          <h2 className="text-lg font-semibold text-slate-900">Page not found</h2>
          <p className="text-sm text-slate-500">The page you're looking for doesn't exist.</p>
          <Link
            to="/dashboard"
            className="inline-block px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Go to Dashboard
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
