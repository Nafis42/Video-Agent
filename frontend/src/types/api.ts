// POST /process response
export interface UploadResponse {
    job_id: string
    status: string
  }
  
  // GET /status response
  export interface JobStatusResponse {
    job_id: string
    status: "queued" | "processing" | "completed" | "failed"
    progress: number
    logs: string[]
    result?: ProcessResult | null
    error?: string | null
  }
  
  // Processing result
  export interface ProcessResult {
    meeting_id: string
    title: string
    transcript: string
    summary: string
    action_items: string[]
    key_decisions: string[]
    open_questions: string[]
  }
  
  // POST /chat request
  export interface ChatRequest {
    meeting_id: string
    question: string
  }
  
  // POST /chat response
  export interface ChatResponse {
    answer: string
  }

  export interface ChatMessage {
    id: string
    role: "user" | "assistant"
    content: string
  }

  export interface ChatResponse {
    answer: string
  }