import axios from "axios"

import type {
  UploadResponse,
  JobStatusResponse,
  ChatRequest,
  ChatResponse,
} from "@/types/api"

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
})

export default api

// ---------------------------
// Start Processing
// ---------------------------

export async function processVideo(
  source: string,
  language: string,
) {
  const response = await api.post<UploadResponse>(
    "/process",
    {
      source,
      language,
    },
  )

  return response.data
}

export async function uploadVideo(
  file: File,
  language: string,
) {
  const formData = new FormData()

  formData.append("file", file)
  formData.append("language", language)

  const response = await api.post<UploadResponse>(
    "/upload",
    formData,
  )

  return response.data
}

// ---------------------------
// Get Status
// ---------------------------

export async function getStatus(
  jobId: string,
) {
  const response = await api.get<JobStatusResponse>(
    `/status/${jobId}`,
  )

  return response.data
}

// ---------------------------
// Chat
// ---------------------------

export async function chatWithVideo(
  meetingId: string,
  question: string
) {
  const response = await api.post("/chat", {
    meeting_id: meetingId,
    question,
  })

  return response.data
}



