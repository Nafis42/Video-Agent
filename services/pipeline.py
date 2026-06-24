from dotenv import load_dotenv
import uuid

from services.job_store import set_progress

from utils.audio_processor import process_input
from core.transcriber import transcribe_all
from core.summarizer import summarize, generate_title
from core.extractor import (
    extract_action_items,
    extract_key_decisions,
    extract_questions,
)
from core.rag_engine import build_rag_chain

load_dotenv()


def run_pipeline(
    source: str,
    language: str = "english",
    job_id: str | None = None,
    logger=None,
) -> dict:

    def log(message: str):
        if logger:
            logger(message)

    def progress(value: int):
        if job_id:
            set_progress(job_id, value)

    progress(5)
    log("Starting AI Video Assistant")

    meeting_id = str(uuid.uuid4())

    log("Processing input source")
    chunks = process_input(
        source,
        logger=logger,
    )

    progress(20)

    log("Starting transcription")
    transcript = transcribe_all(
        chunks,
        language,
        logger=logger,
    )

    progress(50)

    title = generate_title(
        transcript,
        logger=logger,
    )

    log("Generating summary")
    summary = summarize(
        transcript,
        logger=logger,
    )

    progress(70)

    log("Extracting action items")
    action_item = extract_action_items(transcript)

    log("Extracting key decisions")
    decisions = extract_key_decisions(transcript)

    log("Extracting open questions")
    questions = extract_questions(transcript)

    progress(80)

    log("Building RAG knowledge base")

    build_rag_chain(
        transcript=transcript,
        meeting_id=meeting_id,
        logger=logger,
    )

    progress(95)

    log("Pipeline completed successfully")

    progress(100)

    return {
        "meeting_id": meeting_id,
        "title": title,
        "transcript": transcript,
        "summary": summary,
        "action_items": action_item,
        "key_decisions": decisions,
        "open_questions": questions,
    }

