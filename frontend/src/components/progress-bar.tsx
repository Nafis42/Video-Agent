import { motion } from "framer-motion"

interface ProgressBarProps {
  value: number // 0 - 100
}

export function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-muted">Overall progress</span>
        <span className="font-semibold text-foreground">
          {Math.round(value)}%
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
        <motion.div
          className="h-full rounded-full bg-gradient-brand"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ ease: "easeOut", duration: 0.6 }}
        />
      </div>
    </div>
  )
}
