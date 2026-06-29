import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { UploadCard } from "@/components/upload-card"

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

export function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-3xl text-center"
      >
        <motion.div
          variants={item}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)]/60 px-4 py-1.5 text-sm text-muted backdrop-blur"
        >
          <Sparkles className="h-4 w-4 text-[var(--color-accent)]" />
          Powered by Whisper + RAG knowledge bases
        </motion.div>

        <motion.h1
          variants={item}
          className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl"
        >
          Turn Any Video into{" "}
          <span className="text-gradient">Searchable Knowledge</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg"
        >
          Upload a video or paste a YouTube link. AI will transcribe it,
          summarize it, build a searchable knowledge base and let you chat with
          your content.
        </motion.p>
      </motion.div>

      <div className="mt-14">
        <UploadCard />
      </div>
    </section>
  )
}
