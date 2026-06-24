import os

from services.pipeline import run_pipeline

from services.job_store import (
    add_log,
    set_status,
    save_result,
    save_error,
)


def process_job(
    job_id: str,
    source: str,
    language: str,
):
    try:

        set_status(job_id, "processing")

        add_log(job_id, "Starting AI Video Assistant")

        result = run_pipeline(
            source=source,
            language=language,
            job_id=job_id,
            logger=lambda msg: add_log(job_id, msg),
        )

        save_result(job_id, result)

        set_status(job_id, "completed")

    except Exception as e:

        save_error(job_id, str(e))

        set_status(job_id, "failed")

    finally:

        if (
            os.path.exists(source)
            and source.startswith("uploads")
        ):
            os.remove(source)

