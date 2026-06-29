from pydantic import BaseModel

class ProcessRequest(BaseModel):
    source: str
    language: str = "english"

class ChatRequest(BaseModel):
    meeting_id: str
    question: str

class ProcessResponse(BaseModel):
    meeting_id: str
    title: str
    transcript: str
    summary: str
    action_items: list[str]
    key_decisions: list[str]
    open_questions: list[str]


class ChatResponse(BaseModel):
    answer: str


class UploadResponse(BaseModel):
    job_id: str
    status: str


class JobStatusResponse(BaseModel):
    job_id: str
    status: str
    progress: int
    logs: list[str]
    result: dict | None = None
    error: str | None = None

 