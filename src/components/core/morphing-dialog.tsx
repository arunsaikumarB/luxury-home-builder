import React, {
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from 'react'
import { createPortal } from 'react-dom'
import {
  AnimatePresence,
  motion,
  MotionConfig,
  type Transition,
  type Variant,
} from 'framer-motion'
import { XIcon } from 'lucide-react'
import { useClickOutside } from '@/hooks/useClickOutside'
import { cn } from '@/lib/utils'

export type MorphingDialogContextType = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  uniqueId: string
  triggerRef: RefObject<HTMLButtonElement | null>
}

const MorphingDialogContext = React.createContext<MorphingDialogContextType | null>(null)

function useMorphingDialog() {
  const context = useContext(MorphingDialogContext)
  if (!context) {
    throw new Error('useMorphingDialog must be used within a MorphingDialogProvider')
  }
  return context
}

function MorphingDialogProvider({
  children,
  transition,
}: {
  children: ReactNode
  transition?: Transition
}) {
  const [isOpen, setIsOpen] = useState(false)
  const uniqueId = useId()
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const contextValue = useMemo(
    () => ({ isOpen, setIsOpen, uniqueId, triggerRef }),
    [isOpen, uniqueId],
  )

  return (
    <MotionConfig transition={transition}>
      <MorphingDialogContext.Provider value={contextValue}>
        {children}
      </MorphingDialogContext.Provider>
    </MotionConfig>
  )
}

export type MorphingDialogProps = {
  children: ReactNode
  transition?: Transition
}

function MorphingDialog({ children, transition }: MorphingDialogProps) {
  return <MorphingDialogProvider transition={transition}>{children}</MorphingDialogProvider>
}

export type MorphingDialogTriggerProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
  triggerRef?: RefObject<HTMLButtonElement | null>
  'data-cursor'?: string
}

function MorphingDialogTrigger({
  children,
  className,
  style,
  triggerRef,
  'data-cursor': dataCursor,
}: MorphingDialogTriggerProps) {
  const { setIsOpen, isOpen, uniqueId, triggerRef: contextTriggerRef } = useMorphingDialog()
  const ref = triggerRef ?? contextTriggerRef

  const handleClick = useCallback(() => {
    setIsOpen(!isOpen)
  }, [isOpen, setIsOpen])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        setIsOpen(!isOpen)
      }
    },
    [isOpen, setIsOpen],
  )

  return (
    <motion.button
      ref={ref}
      layoutId={`dialog-${uniqueId}`}
      className={cn('relative cursor-pointer', className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={style}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls={`motion-ui-morphing-dialog-content-${uniqueId}`}
      aria-label="Open details"
      type="button"
      data-cursor={dataCursor}
    >
      {children}
    </motion.button>
  )
}

export type MorphingDialogContentProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

function MorphingDialogContent({ children, className, style }: MorphingDialogContentProps) {
  const { setIsOpen, isOpen, uniqueId, triggerRef } = useMorphingDialog()
  const containerRef = useRef<HTMLDivElement | null>(null!)
  const [firstFocusableElement, setFirstFocusableElement] = useState<HTMLElement | null>(null)
  const [lastFocusableElement, setLastFocusableElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
      if (event.key === 'Tab') {
        if (!firstFocusableElement || !lastFocusableElement) return
        if (event.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            event.preventDefault()
            lastFocusableElement.focus()
          }
        } else if (document.activeElement === lastFocusableElement) {
          event.preventDefault()
          firstFocusableElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [setIsOpen, firstFocusableElement, lastFocusableElement])

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden')

      const focusableElements = containerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (focusableElements && focusableElements.length > 0) {
        setFirstFocusableElement(focusableElements[0] as HTMLElement)
        setLastFocusableElement(
          focusableElements[focusableElements.length - 1] as HTMLElement,
        )
        ;(focusableElements[0] as HTMLElement).focus()
      }
    } else {
      document.body.classList.remove('overflow-hidden')
      triggerRef.current?.focus()
    }

    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [isOpen, triggerRef])

  useClickOutside(containerRef, () => {
    if (isOpen) setIsOpen(false)
  })

  return (
    <motion.div
      ref={containerRef}
      layoutId={`dialog-${uniqueId}`}
      className={cn('overflow-hidden', className)}
      style={style}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`motion-ui-morphing-dialog-title-${uniqueId}`}
      aria-describedby={`motion-ui-morphing-dialog-description-${uniqueId}`}
      id={`motion-ui-morphing-dialog-content-${uniqueId}`}
    >
      {children}
    </motion.div>
  )
}

function MorphingDialogContainer({ children }: { children: ReactNode }) {
  const { isOpen, uniqueId } = useMorphingDialog()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence initial={false} mode="sync">
      {isOpen && (
        <>
          <motion.div
            key={`backdrop-${uniqueId}`}
            className="fixed inset-0 z-[80] h-full w-full bg-foreground/35 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <div className="fixed inset-0 z-[90] flex items-center justify-center pointer-events-none p-4 md:p-6">
            {children}
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}

function MorphingDialogTitle({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  const { uniqueId } = useMorphingDialog()

  return (
    <motion.div
      layoutId={`dialog-title-container-${uniqueId}`}
      className={className}
      style={style}
      layout
      id={`motion-ui-morphing-dialog-title-${uniqueId}`}
    >
      {children}
    </motion.div>
  )
}

function MorphingDialogSubtitle({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  const { uniqueId } = useMorphingDialog()

  return (
    <motion.div
      layoutId={`dialog-subtitle-container-${uniqueId}`}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

function MorphingDialogDescription({
  children,
  className,
  variants,
  disableLayoutAnimation,
}: {
  children: ReactNode
  className?: string
  disableLayoutAnimation?: boolean
  variants?: {
    initial: Variant
    animate: Variant
    exit: Variant
  }
}) {
  const { uniqueId } = useMorphingDialog()

  return (
    <motion.div
      key={`dialog-description-${uniqueId}`}
      layoutId={
        disableLayoutAnimation ? undefined : `dialog-description-content-${uniqueId}`
      }
      variants={variants}
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      id={`motion-ui-morphing-dialog-description-${uniqueId}`}
    >
      {children}
    </motion.div>
  )
}

function MorphingDialogImage({
  src,
  alt,
  className,
  style,
}: {
  src: string
  alt: string
  className?: string
  style?: CSSProperties
}) {
  const { uniqueId } = useMorphingDialog()

  return (
    <motion.img
      src={src}
      alt={alt}
      className={cn(className)}
      layoutId={`dialog-img-${uniqueId}`}
      style={style}
    />
  )
}

function MorphingDialogClose({
  children,
  className,
  variants,
}: {
  children?: ReactNode
  className?: string
  variants?: {
    initial: Variant
    animate: Variant
    exit: Variant
  }
}) {
  const { setIsOpen, uniqueId } = useMorphingDialog()

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  return (
    <motion.button
      onClick={handleClose}
      type="button"
      aria-label="Close dialog"
      key={`dialog-close-${uniqueId}`}
      className={cn('absolute top-5 right-5 z-10', className)}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
    >
      {children || <XIcon size={20} />}
    </motion.button>
  )
}

export {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
  MorphingDialogDescription,
  MorphingDialogImage,
}
