
jobs = {}


def create_job(job_id: str):
    jobs[job_id] = {
        "status": "queued",
        "progress": 0,
        "logs": [],
        "result": None,
        "error": None,
    }


def add_log(job_id: str, message: str):
    if job_id in jobs:
        jobs[job_id]["logs"].append(message)


def set_status(job_id: str, status: str):
    if job_id in jobs:
        jobs[job_id]["status"] = status


def save_result(job_id: str, result: dict):
    if job_id in jobs:
        jobs[job_id]["result"] = result


def save_error(job_id: str, error: str):
    if job_id in jobs:
        jobs[job_id]["error"] = error

def set_progress(job_id: str, progress: int):
    if job_id in jobs:
        jobs[job_id]["progress"] = progress
