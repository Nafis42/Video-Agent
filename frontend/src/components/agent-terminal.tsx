import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Terminal } from "lucide-react"

interface AgentTerminalProps {
  logs: string[]
  done: boolean
}

export function AgentTerminal({ logs, done }: AgentTerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to the latest log line.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [logs])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[#0b0b12] shadow-2xl"
    >
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface)]/40 px-4 py-3">
        <span className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </span>
        <span className="ml-2 flex items-center gap-2 text-xs font-medium text-muted">
          <Terminal className="h-3.5 w-3.5" />
          ai-agent — pipeline
        </span>
      </div>

      <div
        ref={scrollRef}
        className="h-72 overflow-y-auto px-5 py-4 font-mono text-[13px] leading-relaxed"
      >
        {logs.map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="flex gap-2.5 py-0.5"
          >
            <span className="select-none text-[var(--color-accent)]">
              {"\u003E"}
            </span>
            <span className="text-foreground/85">{log}</span>
          </motion.div>
        ))}

        {!done && (
          <div className="flex gap-2.5 py-0.5">
            <span className="select-none text-[var(--color-accent)]">
              {"\u003E"}
            </span>
            <span className="inline-block h-4 w-2 animate-pulse bg-[var(--color-accent)]" />
          </div>
        )}

        {done && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 flex gap-2.5 py-0.5 text-[#28c840]"
          >
            <span className="select-none">{"\u2713"}</span>
            <span>Process complete. Redirecting to dashboard...</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
