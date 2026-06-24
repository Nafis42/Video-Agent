
from fastapi import (
    FastAPI,
    UploadFile,
    File,
    HTTPException,
    BackgroundTasks,
)

import os
import shutil
import uuid

from fastapi.middleware.cors import CORSMiddleware

from models.schemas import (
    ProcessRequest,
    ChatRequest,
    ChatResponse,
    UploadResponse,
    JobStatusResponse,
)

from core.rag_engine import (
    load_rag_chain,
    ask_question,
)

from services.job_store import (
    jobs,
    create_job,
)

from services.background_processor import (
    process_job,
)

app = FastAPI(
    title="AI Meeting Assistant",
    description="""
AI-powered meeting assistant that:

- Transcribes videos and meetings
- Generates summaries
- Extracts action items
- Extracts decisions
- Builds a RAG knowledge base
- Supports conversational querying
""",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "AI Meeting Assistant API"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


@app.post(
    "/process",
    response_model=UploadResponse,
    tags=["Processing"]
)
def process(
    request: ProcessRequest,
    background_tasks: BackgroundTasks
):

    try:

        job_id = str(uuid.uuid4())

        create_job(job_id)

        background_tasks.add_task(
            process_job,
            job_id,
            request.source,
            request.language,
        )

        return {
            "job_id": job_id,
            "status": "queued",
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Processing failed: {str(e)}",
        )


@app.post(
    "/upload",
    response_model=UploadResponse,
    tags=["Processing"]
)
async def upload_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    language: str = "english",
):

    try:

        UPLOAD_DIR = "uploads"

        os.makedirs(
            UPLOAD_DIR,
            exist_ok=True,
        )

        file_path = os.path.join(
            UPLOAD_DIR,
            file.filename,
        )

        with open(file_path, "wb") as buffer:

            shutil.copyfileobj(
                file.file,
                buffer,
            )

        job_id = str(uuid.uuid4())

        create_job(job_id)

        background_tasks.add_task(
            process_job,
            job_id,
            file_path,
            language,
        )

        return {
            "job_id": job_id,
            "status": "queued",
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Upload failed: {str(e)}",
        )


@app.get(
    "/status/{job_id}",
    response_model=JobStatusResponse,
    tags=["Processing"]
)
def get_status(job_id: str):

    if job_id not in jobs:

        raise HTTPException(
            status_code=404,
            detail="Job not found",
        )

    return {
        "job_id": job_id,
        "status": jobs[job_id]["status"],
        "progress": jobs[job_id]["progress"],
        "logs": jobs[job_id]["logs"],
        "result": jobs[job_id]["result"],
        "error": jobs[job_id]["error"],
    }


@app.post(
    "/chat",
    response_model=ChatResponse,
    tags=["Chat"]
)
def chat(request: ChatRequest):

    try:

        rag_chain = load_rag_chain(
            request.meeting_id
        )

        answer = ask_question(
            rag_chain,
            request.question,
        )

        return {
            "answer": answer
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Chat failed: {str(e)}",
        )

