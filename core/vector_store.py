import os

from langchain_chroma import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

BASE_CHROMA_DIR = "vector_db"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"


def get_embeddings(logger=None):

    if logger:
        logger(
            f"Loading embedding model ({EMBEDDING_MODEL})..."
        )

    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL,
        model_kwargs={"device": "cpu"},
    )

    if logger:
        logger(
            "Embedding model loaded"
        )

    return embeddings


def build_vector_store(
    transcript: str,
    meeting_id: str,
    logger=None,
) -> Chroma:

    if logger:
        logger(
            "Splitting transcript for embeddings..."
        )

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
    )

    chunks = splitter.split_text(
        transcript
    )

    if logger:
        logger(
            f"Created {len(chunks)} vector chunks"
        )

    docs = [
        Document(
            page_content=chunk,
            metadata={
                "chunk_index": i,
                "meeting_id": meeting_id,
            },
        )
        for i, chunk in enumerate(chunks)
    ]

    embeddings = get_embeddings(
        logger=logger
    )

    persist_directory = os.path.join(
        BASE_CHROMA_DIR,
        meeting_id,
    )

    if logger:
        logger(
            "Generating embeddings and storing vectors..."
        )

    vector_store = Chroma.from_documents(
        documents=docs,
        embedding=embeddings,
        collection_name=meeting_id,
        persist_directory=persist_directory,
    )

    if logger:
        logger(
            "Vector store created successfully"
        )

    return vector_store


def load_vector_store(
    meeting_id: str
) -> Chroma:

    embeddings = get_embeddings()

    persist_directory = os.path.join(
        BASE_CHROMA_DIR,
        meeting_id,
    )

    vector_store = Chroma(
        collection_name=meeting_id,
        embedding_function=embeddings,
        persist_directory=persist_directory,
    )

    return vector_store


def get_retriever(
    vector_store: Chroma,
    k: int = 4
):
    return vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k": k},
    )

