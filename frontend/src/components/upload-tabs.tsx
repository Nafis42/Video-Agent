import { motion } from "framer-motion"
import { Upload, Youtube } from "lucide-react"
import { cn } from "@/lib/utils"

export type UploadTab = "file" | "youtube"

interface UploadTabsProps {
  value: UploadTab
  onChange: (value: UploadTab) => void
}

const tabs = [
  { id: "file" as const, label: "Upload File", icon: Upload },
  { id: "youtube" as const, label: "YouTube URL", icon: Youtube },
]

export function UploadTabs({ value, onChange }: UploadTabsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/40 p-1.5">
      {tabs.map((tab) => {
        const active = value === tab.id
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
              active ? "text-white" : "text-muted hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="upload-tab-pill"
                className="absolute inset-0 rounded-lg bg-gradient-brand shadow-lg shadow-[var(--color-accent)]/25"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
