import { motion } from 'framer-motion'

export function FloatingShapes() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute -left-24 top-1/4 h-72 w-72 rounded-full border border-accent/10"
        animate={{ y: [0, 40, 0], x: [0, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-10 top-1/3 h-40 w-40 rounded-full bg-accent/5 blur-2xl"
        animate={{ y: [0, -50, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/2 h-64 w-64 -translate-x-1/2 rotate-12 border border-foreground/5"
        animate={{ rotate: [12, 24, 12], y: [0, 30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
