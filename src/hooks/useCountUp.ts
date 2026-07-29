import { useEffect, useRef, useState } from 'react'

interface UseCountUpOptions {
  end: number
  duration?: number
  startOnView?: boolean
}

export function useCountUp({ end, duration = 1800, startOnView = true }: UseCountUpOptions) {
  const [value, setValue] = useState(0)
  const [hasStarted, setHasStarted] = useState(!startOnView)
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!startOnView) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [startOnView])

  useEffect(() => {
    if (!hasStarted) return
    let start: number | null = null
    let frame: number

    const animate = (timestamp: number) => {
      if (start === null) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setValue(Math.round(eased * end))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [hasStarted, end, duration])

  return { value, ref }
}
