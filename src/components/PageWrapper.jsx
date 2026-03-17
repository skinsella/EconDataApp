import { useEffect } from 'react'
import { motion } from 'framer-motion'

export function PageWrapper({ title, children }) {
  useEffect(() => {
    document.title = title ? `${title} | Econ Dashboard` : 'Econ Dashboard'
  }, [title])

  return (
    <motion.div
      className="p-8 space-y-8 overflow-y-auto h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  )
}
