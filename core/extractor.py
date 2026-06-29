import json
import os

from langchain_mistralai import ChatMistralAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough, RunnableLambda


def get_llm():
    return ChatMistralAI(
        model="mistral-small-latest",
        mistral_api_key=os.getenv("MISTRAL_API_KEY"),
        temperature=0.2,
    )


def build_chain(system_prompt: str):
    llm = get_llm()

    return (
        RunnablePassthrough()
        | RunnableLambda(lambda x: {"text": x})
        | ChatPromptTemplate.from_messages(
            [
                ("system", system_prompt),
                ("human", "{text}"),
            ]
        )
        | llm
        | StrOutputParser()
    )


def parse_list_response(response: str) -> list[str]:
    """
    Converts the LLM JSON response into a Python list.
    Falls back to returning the raw response if parsing fails.
    """

    response = response.strip()

    # Remove markdown code fences if present
    if response.startswith("```"):
        response = response.replace("```json", "")
        response = response.replace("```", "")
        response = response.strip()

    try:
        data = json.loads(response)

        if isinstance(data, list):
            return data

    except Exception:
        pass

    return [response]


def extract_action_items(transcript: str) -> list[str]:

    chain = build_chain(
        """
You are an expert meeting analyst.

Extract every action item from the meeting.

Return ONLY a valid JSON array.

Example:

[
    "Finish login page - Owner: John - Deadline: Friday",
    "Deploy backend - Owner: Alice - Deadline: Next week"
]

Rules:
- Return ONLY JSON.
- No markdown.
- No numbering.
- No explanation.
- If nothing is found return [].
"""
    )

    return parse_list_response(chain.invoke(transcript))


def extract_key_decisions(transcript: str) -> list[str]:

    chain = build_chain(
        """
You are an expert meeting analyst.

Extract all important decisions made during the meeting.

Return ONLY a JSON array.

Example:

[
    "Backend will use FastAPI",
    "Redis will be used for caching"
]

Rules:
- Return ONLY JSON.
- No markdown.
- No numbering.
- No explanation.
- If nothing is found return [].
"""
    )

    return parse_list_response(chain.invoke(transcript))


def extract_questions(transcript: str) -> list[str]:

    chain = build_chain(
        """
You are an expert meeting analyst.

Identify any questions, unresolved topics, uncertainties, audience questions, future work, or discussion points mentioned in the transcript.

This includes:
- Questions asked by the speaker
- Questions asked by other participants
- Topics left unanswered
- Areas suggested for future exploration

Return ONLY a JSON array.

Example:

[
    "Should we deploy on AWS?",
    "Do we need user authentication?"
]

Rules:
- Return ONLY JSON.
- No markdown.
- No numbering.
- No explanation.
- If nothing is found return [].
"""
    )

    return parse_list_response(chain.invoke(transcript))