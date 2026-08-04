/** Lightweight CSS ambient shapes — no perpetual Framer Motion rAF cost. */
export function FloatingShapes() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="ambient-orb ambient-orb--a absolute -left-24 top-1/4 h-72 w-72 rounded-full border border-accent/10" />
      <div className="ambient-orb ambient-orb--b absolute right-10 top-1/3 h-40 w-40 rounded-full bg-accent/[0.06]" />
      <div className="ambient-orb ambient-orb--c absolute bottom-1/4 left-1/2 h-64 w-64 -translate-x-1/2 rotate-12 border border-foreground/5" />
    </div>
  )
}
