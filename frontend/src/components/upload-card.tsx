import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { FileVideo, Link2, UploadCloud, ArrowRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UploadTabs, type UploadTab } from "@/components/upload-tabs"
import { LanguageSelector, type Language } from "@/components/language-selector"
import { cn } from "@/lib/utils"
import { processVideo,uploadVideo } from "@/services/api"

const SUPPORTED = ["mp4", "mp3", "wav", "m4a"]

export function UploadCard() {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [tab, setTab] = useState<UploadTab>("file")
  const [language, setLanguage] = useState<Language>("english")
  const [dragging, setDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const canProcess = tab === "file" ? !!selectedFile : url.trim().length > 0

  async function handleProcess() {

    try {
  
      setIsLoading(true)
      console.log("1. Starting request")
  
      let response
  
      if (tab === "youtube") {
  
        response = await processVideo(
          url,
          language,
        )

  
      } else {
  
        if (!selectedFile) return
  
        response = await uploadVideo(
          selectedFile,
          language,
        )
      }
      localStorage.setItem("ai_video_current_job", response.job_id)
      console.log("2. Response received", response)

      navigate("/processing", {
        state: {
          jobId: response.job_id,
        },
      })
      console.log("3. Navigated")
  
    } catch (error) {
  
      console.error(error)
  
      alert("Failed to start processing.")
  
    } finally {
  
      setIsLoading(false)
  
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      className="relative mx-auto w-full max-w-2xl"
    >
      {/* gradient ring */}
      <div className="absolute -inset-px rounded-3xl bg-gradient-brand opacity-30 blur-sm" />
      <div className="relative rounded-3xl border border-[var(--color-border-strong)] bg-[var(--color-surface)]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <UploadTabs value={tab} onChange={setTab} />

        <div className="mt-6">
          <AnimatePresence mode="wait">
            {tab === "file" ? (
              <motion.div
                key="file"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.25 }}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".mp4,.mp3,.wav,.m4a"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) setSelectedFile(f)
                  }}
                />
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => inputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      inputRef.current?.click()
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragging(true)
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setDragging(false)
                    const f = e.dataTransfer.files?.[0]
                    if (f) setSelectedFile(f)
                  }}
                  className={cn(
                    "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-all duration-200",
                    dragging
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                      : "border-[var(--color-border-strong)] bg-[var(--color-background)]/30 hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-surface-2)]",
                  )}
                >
                  <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand shadow-lg shadow-[var(--color-accent)]/25">
                    <UploadCloud className="h-7 w-7 text-white" />
                  </span>
                  <p className="text-base font-medium">
                    Drag & drop your file here
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    or click to browse from your device
                  </p>
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                    {SUPPORTED.map((ext) => (
                      <span
                        key={ext}
                        className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2.5 py-1 text-xs font-medium text-muted"
                      >
                        .{ext}
                      </span>
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {selectedFile && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] p-3"
                    >
                      <span className="flex items-center gap-3 truncate">
                        <FileVideo className="h-5 w-5 shrink-0 text-[var(--color-accent)]" />
                        <span className="truncate text-sm">{selectedFile?.name}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        aria-label="Remove file"
                        className="rounded-md p-1 text-muted transition-colors hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="youtube"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
              >
                <label
                  htmlFor="yt-url"
                  className="mb-2 block text-sm font-medium text-muted"
                >
                  YouTube video URL
                </label>
                <div className="relative">
                  <Link2 className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
                  <input
                    id="yt-url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="h-14 w-full rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-background)]/40 pl-12 pr-4 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/30"
                  />
                </div>
                <p className="mt-2 text-xs text-muted">
                  Paste any public YouTube link and we&apos;ll handle the rest.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6">
          <LanguageSelector value={language} onChange={setLanguage} />
        </div>

        <Button
          size="lg"
          className="mt-7 w-full"
          disabled={!canProcess || isLoading}
          onClick={handleProcess}
        >
          {isLoading ? "Starting..." : "Process Video"}
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  )
}
