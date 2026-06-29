import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Send, Sparkles, MessagesSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
// import {
//   initialChat,
//   suggestedPrompts,
//   mockAssistantReply,
//   type ChatMessage,
// } from "@/lib/mock-data"

import { chatWithVideo } from "@/services/api"
import type { ChatMessage } from "@/types/api"

interface ChatPanelProps {
  meetingId: string
}

export function ChatPanel({meetingId}:ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! Ask me anything about your video.",
    },
  ])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  const suggestedPrompts = [
    "Summarize the video",
    "What are the key decisions?",
    "List all action items",
    "What questions remain open?",
  ]

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || typing) return

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setTyping(true)

    // Mock assistant response with a small delay to feel natural.
    async function send(text: string) {
      const trimmed = text.trim()
    
      if (!trimmed || typing) return
    
      const userMessage: ChatMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        content: trimmed,
      }
    
      setMessages((prev) => [...prev, userMessage])
    
      setInput("")
    
      setTyping(true)
    
      try {
        const response = await chatWithVideo(
          meetingId,
          trimmed
        )
    
        const assistantMessage: ChatMessage = {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: response.answer,
        }
    
        setMessages((prev) => [
          ...prev,
          assistantMessage,
        ])
      } catch (error) {
        console.error(error)
    
        setMessages((prev) => [
          ...prev,
          {
            id: `e-${Date.now()}`,
            role: "assistant",
            content:
              "Sorry, something went wrong while generating the answer.",
          },
        ])
      } finally {
        setTyping(false)
      }
    }
  }

  return (
    <section className="mt-16">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand shadow-lg shadow-[var(--color-accent)]/25">
          <MessagesSquare className="h-5 w-5 text-white" />
        </span>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Chat with your Video
          </h2>
          <p className="text-sm text-muted">
            Grounded answers from your video&apos;s knowledge base.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)]">
        {/* Messages */}
        <div className="flex h-[26rem] flex-col gap-5 overflow-y-auto p-5 sm:p-6">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex gap-3",
                m.role === "user" ? "flex-row-reverse" : "flex-row",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold",
                  m.role === "assistant"
                    ? "bg-gradient-brand text-white"
                    : "border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] text-foreground",
                )}
              >
                {m.role === "assistant" ? (
                  <Sparkles className="h-4 w-4" />
                ) : (
                  "You"
                )}
              </span>
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  m.role === "assistant"
                    ? "rounded-tl-sm bg-[var(--color-surface-2)] text-foreground/90"
                    : "rounded-tr-sm bg-gradient-brand text-white",
                )}
              >
                {m.content}
              </div>
            </motion.div>
          ))}

          <AnimatePresence>
            {typing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-white">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-[var(--color-surface-2)] px-4 py-3.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-2 w-2 rounded-full bg-muted"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={endRef} />
        </div>

        {/* Suggested prompts */}
        <div className="flex flex-wrap gap-2 border-t border-[var(--color-border)] px-5 py-4 sm:px-6">
          {suggestedPrompts.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => send(p)}
              disabled={typing}
              className="rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-[var(--color-accent)]/50 hover:text-foreground disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send(input)
          }}
          className="flex items-center gap-3 border-t border-[var(--color-border)] p-4 sm:px-6"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your video..."
            className="h-12 flex-1 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-background)]/40 px-4 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/30"
          />
          <Button
            type="submit"
            size="icon"
            className="h-12 w-12 shrink-0"
            disabled={!input.trim() || typing}
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </section>
  )
}
