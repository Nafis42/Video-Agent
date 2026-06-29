// Centralized mock data. Replace these with real API calls to your FastAPI
// backend later — the UI only reads from these shapes.

export type SourceType = "youtube" | "upload"

export interface VideoMeta {
  title: string
  processedAt: string
  source: SourceType
  duration: string
}

export const mockVideo: VideoMeta = {
  title: "Designing Scalable Systems: A Deep Dive into Distributed Architecture",
  processedAt: "June 26, 2026 · 2:14 PM",
  source: "youtube",
  duration: "42:18",
}

export const mockSummary = `This session breaks down the core principles of building distributed systems that scale gracefully under load. The speaker walks through partitioning strategies, the trade-offs between consistency and availability, and how to design for failure as a first-class concern. Real-world examples from large-scale platforms illustrate how thoughtful architecture decisions early on prevent costly rewrites later.`

export const mockActionItems: string[] = [
  "Audit current database partitioning strategy against expected 2x traffic growth.",
  "Introduce a read-replica layer before the next product launch.",
  "Document failure modes for each critical service in the runbook.",
  "Schedule a load-testing session to validate the new caching layer.",
]

export const mockKeyDecisions: string[] = [
  "Adopt eventual consistency for the notifications pipeline to reduce write latency.",
  "Move session storage to Redis for horizontal scalability.",
  "Standardize on idempotency keys for all payment-related endpoints.",
]

export const mockOpenQuestions: string[] = [
  "Should the analytics service own its own datastore or share the primary cluster?",
  "What is the acceptable replication lag for the reporting dashboard?",
  "How do we handle backpressure when the queue saturates during spikes?",
]

export const processingLogs: string[] = [
  "Downloading YouTube audio...",
  "Audio downloaded successfully",
  "Chunking audio",
  "Created 8 chunks",
  "Loading Whisper model",
  "Whisper model loaded",
  "Transcribing chunk 1/8",
  "Transcribing chunk 2/8",
  "Transcribing chunk 3/8",
  "Transcribing chunk 4/8",
  "Transcribing chunk 5/8",
  "Transcribing chunk 6/8",
  "Transcribing chunk 7/8",
  "Transcribing chunk 8/8",
  "Generating title",
  "Generating summary",
  "Extracting action items & decisions",
  "Building vector database",
  "Knowledge base ready",
]

export const processingStages: string[] = [
  "Downloading Audio",
  "Transcribing Audio",
  "Generating Summary",
  "Building Knowledge Base",
]

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

export const suggestedPrompts: string[] = [
  "Summarize this video",
  "What are the key takeaways?",
  "What decisions were made?",
  "Explain this topic simply",
]

export const initialChat: ChatMessage[] = [
  {
    id: "m1",
    role: "assistant",
    content:
      "Hi! I've read through your entire video and built a searchable knowledge base from it. Ask me anything — summaries, specific moments, decisions, or follow-up questions.",
  },
]

// Canned responses keyed loosely by intent — purely for the mock UI.
export function mockAssistantReply(prompt: string): string {
  const p = prompt.toLowerCase()
  if (p.includes("summar")) {
    return "In short: the talk covers how to design distributed systems that scale, focusing on partitioning, the consistency–availability trade-off, and treating failure as a first-class design concern. It uses real platform examples to show how early architectural choices save costly rewrites."
  }
  if (p.includes("takeaway") || p.includes("key")) {
    return "Three big takeaways: 1) Partition early and intentionally. 2) Choose your consistency model per-feature, not globally. 3) Design every service assuming its dependencies will fail."
  }
  if (p.includes("decision")) {
    return "Key decisions made: adopt eventual consistency for notifications, move session storage to Redis, and standardize idempotency keys across payment endpoints."
  }
  if (p.includes("simpl") || p.includes("explain")) {
    return "Think of it like a busy restaurant: instead of one giant kitchen (a single server), you split the work into stations (partitions). Some orders can wait a moment (eventual consistency), but payments must always be exact (strong guarantees)."
  }
  return "Based on the video's knowledge base, here's what I found relevant to your question. The speaker emphasizes designing for failure and choosing the right consistency model for each part of the system. Want me to point you to the exact moment this was discussed?"
}
