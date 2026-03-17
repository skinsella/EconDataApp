import { useState, useEffect } from 'react'

export function useCountdown(targetDate) {
  const [days, setDays] = useState(null)

  useEffect(() => {
    const calculate = () => {
      const now = new Date()
      const target = new Date(targetDate)
      now.setHours(0, 0, 0, 0)
      target.setHours(0, 0, 0, 0)
      setDays(Math.ceil((target - now) / (1000 * 60 * 60 * 24)))
    }
    calculate()
    const interval = setInterval(calculate, 1000 * 60 * 60)
    return () => clearInterval(interval)
  }, [targetDate])

  return days
}
