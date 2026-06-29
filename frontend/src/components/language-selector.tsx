import { cn } from "@/lib/utils"

const languages = [
  { id: "english", label: "English", hint: "Standard transcription" },
  { id: "hinglish", label: "Hinglish", hint: "Hindi + English mix" },
] as const

export type Language = (typeof languages)[number]["id"]

interface LanguageSelectorProps {
  value: Language
  onChange: (value: Language) => void
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium text-muted">
        Language
      </legend>
      <div className="grid grid-cols-2 gap-3">
        {languages.map((lang) => {
          const active = value === lang.id
          return (
            <button
              key={lang.id}
              type="button"
              onClick={() => onChange(lang.id)}
              aria-pressed={active}
              className={cn(
                "group flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200",
                active
                  ? "border-[var(--color-accent)]/60 bg-[var(--color-accent)]/10"
                  : "border-[var(--color-border-strong)] bg-[var(--color-surface-2)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface)]",
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
                  active
                    ? "border-[var(--color-accent)]"
                    : "border-[var(--color-muted)]/50",
                )}
              >
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full bg-gradient-brand transition-transform",
                    active ? "scale-100" : "scale-0",
                  )}
                />
              </span>
              <span>
                <span className="block text-sm font-medium">{lang.label}</span>
                <span className="block text-xs text-muted">{lang.hint}</span>
              </span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
