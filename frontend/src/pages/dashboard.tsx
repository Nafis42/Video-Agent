import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLocation } from "react-router-dom"
import {
  FileText,
  ListChecks,
  GitBranch,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

import { SummaryCard, CardList } from "@/components/summary-card"
import { ChatPanel } from "@/components/chat-panel"
import { PageTransition } from "@/components/page-transition"

import type { ProcessResult } from "@/types/api"

export function DashboardPage() {
  const location = useLocation()

  const stateResult = location.state?.result as
    | ProcessResult
    | undefined

  const storedResult = localStorage.getItem(
    "ai_video_last_result"
  )

  const result =
    stateResult ??
    (storedResult
      ? (JSON.parse(storedResult) as ProcessResult)
      : undefined)

  const [showTranscript, setShowTranscript] =
    useState(false)

  if (!result) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-8 py-10 text-center">
          <FileText className="mx-auto mb-4 h-10 w-10 text-[var(--color-accent)]" />
          <h2 className="text-2xl font-semibold">
            No Processing Result Found
          </h2>
          <p className="mt-2 text-muted-foreground">
            Process a video first to view its AI summary.
          </p>
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8">

        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {result.title}
          </h1>
        </motion.div>

        {/* Summary Cards */}

        <div className="mt-10 grid gap-5 md:grid-cols-2">

          <div className="md:col-span-2">
            <SummaryCard
              icon={FileText}
              title="Summary"
              index={0}
            >
              <p className="whitespace-pre-wrap text-foreground/80">
                {result.summary}
              </p>
            </SummaryCard>
          </div>

          <SummaryCard
            icon={ListChecks}
            title="Action Items"
            index={1}
          >
            <CardList items={result.action_items} />
          </SummaryCard>

          <SummaryCard
            icon={GitBranch}
            title="Key Decisions"
            index={2}
          >
            <CardList items={result.key_decisions} />
          </SummaryCard>

          <div className="md:col-span-2">
            <SummaryCard
              icon={HelpCircle}
              title="Open Questions"
              index={3}
            >
              <CardList items={result.open_questions} />
            </SummaryCard>
          </div>

        </div>

        {/* Transcript */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)]"
        >
          <button
            onClick={() =>
              setShowTranscript(!showTranscript)
            }
            className="flex w-full items-center justify-between p-5 transition-colors hover:bg-[var(--color-surface-2)]"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-[var(--color-accent)]" />

              <span className="text-lg font-semibold">
                {showTranscript
                  ? "Hide Full Transcript"
                  : "View Full Transcript"}
              </span>
            </div>

            {showTranscript ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>

          <AnimatePresence initial={false}>
            {showTranscript && (
              <motion.div
                initial={{
                  height: 0,
                  opacity: 0,
                }}
                animate={{
                  height: "auto",
                  opacity: 1,
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.35,
                }}
                className="overflow-hidden"
              >
                <div className="border-t border-[var(--color-border)] p-5">
                  <div className="max-h-[500px] overflow-y-auto rounded-xl bg-[var(--color-background)]/40 p-4">
                    <pre className="whitespace-pre-wrap text-sm leading-7 text-foreground/80">
                      {result.transcript}
                    </pre>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Chat */}

        <ChatPanel meetingId={result.meeting_id} />

      </section>
    </PageTransition>
  )
}