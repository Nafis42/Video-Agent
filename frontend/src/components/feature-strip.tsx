import { motion } from "framer-motion"
import { FileText, Search, MessagesSquare, Wand2 } from "lucide-react"

const features = [
  {
    icon: Wand2,
    title: "Auto Transcription",
    desc: "Accurate speech-to-text powered by Whisper, in English or Hinglish.",
  },
  {
    icon: FileText,
    title: "Smart Summaries",
    desc: "Concise summaries, action items, decisions and open questions.",
  },
  {
    icon: Search,
    title: "Searchable RAG",
    desc: "Every video becomes a vector knowledge base you can query instantly.",
  },
  {
    icon: MessagesSquare,
    title: "Chat With Video",
    desc: "Ask follow-up questions and get grounded, contextual answers.",
  },
]

export function FeatureStrip() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => {
          const Icon = f.icon
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] text-[var(--color-accent)] transition-colors group-hover:border-[var(--color-accent)]/40">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {f.desc}
              </p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
