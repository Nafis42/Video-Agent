import { useEffect,  useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Loader2, Activity } from "lucide-react"
import { ProgressBar } from "@/components/progress-bar"
import { AgentTerminal } from "@/components/agent-terminal"
import { PageTransition } from "@/components/page-transition"
// import { processingLogs, processingStages } from "@/lib/mock-data"
import { useLocation } from "react-router-dom"
import { getStatus } from "@/services/api"
import type { JobStatusResponse } from "@/types/api"


export function ProcessingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const stateJobId = location.state?.jobId

const jobId =
  stateJobId ??
  localStorage.getItem("ai_video_current_job")
  console.log("Location state:", location.state)
  console.log("Job ID:", jobId)

  const [logs, setLogs] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [status,setStatus]=useState<JobStatusResponse["status"]>("queued")

  // const indexRef = useRef(0)

  // const total = processingLogs.length
  // const progress = (logs.length / total) * 100
  // const done = logs.length === total

  // Determine the current stage label from how far we are through the logs.
  // const stageIndex = Math.min(
  //   processingStages.length - 1,
  //   Math.floor((logs.length / total) * processingStages.length),
  // )
  // const currentStage = done
  //   ? "Knowledge Base Ready"
  //   : processingStages[stageIndex]

  const currentStage =
  status === "queued"
    ? "Waiting..."
    : status === "processing"
    ? "Processing Video..."
    : status === "completed"
    ? "Knowledge Base Ready"
    : "Processing Failed"

  // Stream the mock logs one-by-one to simulate an active agent.
  useEffect(() => {

    if (!jobId) return
    console.log(jobId)
  
    const interval = setInterval(async () => {
  
      try {
  
        const response = await getStatus(jobId)
  
        setLogs(response.logs)
  
        setProgress(response.progress)
  
        setStatus(response.status)
  
        if (response.status === "completed") {
  
          clearInterval(interval)
          localStorage.removeItem("ai_video_current_job")

localStorage.setItem(
  "ai_video_last_result",
  JSON.stringify(response.result)
)
          navigate("/dashboard", {
            state: {
              result: response.result,
            },
          })
  
        }
  
        if (response.status === "failed") {
  
          clearInterval(interval)
  
          alert(response.error)
  
        }
  
      } catch (error) {
  
        console.error(error)
  
      }
  
    }, 2000)
  
    return () => clearInterval(interval)
  
  }, [jobId, navigate])

  const done = status === "completed"

  // Once complete, pause briefly then move to the dashboard.
  // useEffect(() => {
  //   if (!done) return
  //   const t = setTimeout(() => navigate("/dashboard"), 1600)
  //   return () => clearTimeout(t)
  // }, [done, navigate])

  return (
    <PageTransition>
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="text-center">
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Processing Your Video
          </h1>
          <p className="mt-3 text-muted">
            Our AI is analyzing your content...
          </p>
        </div>

        <div className="mt-10">
          <ProgressBar value={progress} />
        </div>

        {/* Current stage card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-6 flex items-center gap-4 rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-5"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-brand shadow-lg shadow-[var(--color-accent)]/25">
            {done ? (
              <Activity className="h-6 w-6 text-white" />
            ) : (
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            )}
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted">
              Current Stage
            </p>
            <p className="mt-0.5 text-lg font-semibold">{currentStage}</p>
          </div>
        </motion.div>

        <div className="mt-6">
          <AgentTerminal logs={logs} done={done} />
        </div>
      </section>
    </PageTransition>
  )
}

// export function ProcessingPage() {
//   console.log("Processing page rendered")

//   return (
//     <div style={{ color: "white", padding: 50 }}>
//       HELLO PROCESSING PAGE
//     </div>
//   )
// }