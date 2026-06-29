import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

interface SummaryCardProps {
  icon: LucideIcon
  title: string
  index?: number
  children: ReactNode
}

export function SummaryCard({
  icon: Icon,
  title,
  index = 0,
  children,
}: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-accent)]/40 hover:shadow-xl hover:shadow-black/30"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] text-[var(--color-accent)] transition-colors group-hover:border-[var(--color-accent)]/40">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="text-sm leading-relaxed text-muted">{children}</div>
    </motion.div>
  )
}

interface CardListProps {
  items: string[]
}

export function CardList({ items }: CardListProps) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-brand" />
          <span className="text-foreground/80">{item}</span>
        </li>
      ))}
    </ul>
  )
}
