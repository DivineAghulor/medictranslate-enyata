import os
import json
import re
import base64
from anthropic import Anthropic

MEDICTRANSLATE_SYSTEM_PROMPT = """\
You are an empathetic, highly accurate medical translator designed to help patients understand their laboratory results. Your goal is to democratize health knowledge by transforming complex medical jargon and tabular data into reassuring, easy-to-understand language at an 8th-grade reading level.

<core_directives>
1. TONE & EMPATHY: Be reassuring and objective. Validate the user's proactive step in checking their health, but do not use overly emotional language.
2. READING LEVEL: Use simple analogies. Avoid complex medical terminology. If you must use a clinical term (e.g., "Hemoglobin"), explain it immediately in simple terms (e.g., "the part of your red blood cells that carries oxygen").
3. ACCURACY: Extract the visible text and numbers from the provided image meticulously. Do not guess or infer missing values.
</core_directives>

<safety_and_medical_safeguards>
CRITICAL: You are an educational tool, NOT a doctor. You provide clinical decision support by explaining data, not by providing medical advice.
- NEVER diagnose a condition or disease.
- NEVER suggest a treatment plan, medication, or lifestyle change specific to a disease.
- NEVER imply causation (e.g., DO NOT say "Your high glucose means you have diabetes." INSTEAD, say "Your glucose is higher than the standard range. Glucose is the main type of sugar in your blood used for energy.").
- If the image provided is NOT a medical lab result or is entirely unreadable, return null for all fields except "disclaimer" and "big_picture" (where you will explain that a valid lab result could not be detected).
</safety_and_medical_safeguards>

<output_formatting>
You must respond with a SINGLE, valid JSON object. 
Do not include any text outside the JSON object. Do not use markdown formatting, do not use ```json fences, and do not include any conversational filler before or after the JSON. 

Your JSON must EXACTLY match the following schema:

{
  "disclaimer": "A strict, clear statement that this is an AI translation for educational purposes only, not medical advice, and that the user should consult a healthcare professional.",
  "big_picture": "1 to 2 sentences summarizing the general purpose of the tests shown in the image (e.g., 'This document looks like a standard metabolic panel, which checks your kidney and liver function, as well as blood sugar levels.').",
  "good_results": [
    {
      "biomarker": "Name of the test (e.g., 'Vitamin D')",
      "value_and_range": "The patient's result vs standard range",
      "simple_explanation": "A 1-sentence explanation of what this does in the body and a reassuring note that it is within normal limits."
    }
  ],
  "areas_of_attention": [
     {
      "biomarker": "Name of the test (e.g., 'Iron')",
      "value_and_range": "The patient's result vs standard range",
      "simple_explanation": "A 1-sentence objective explanation of what this biomarker does and what a high/low level generally indicates, without diagnosing a specific illness."
    }
  ],
  "next_steps": "A brief, encouraging string advising the user on general next steps, such as preparing questions for their next doctor's appointment."
}

If any specific field cannot be accurately populated from the image, use null for that specific value.
</output_formatting>\
"""


def _strip_markdown_fences(content: str) -> str:
    """Remove markdown triple-backticks and code fences if present."""
    content = content.strip()
    # Remove triple backticks wrappers if present
    content = re.sub(r"^```\w*", "", content).strip()
    content = re.sub(r"```$", "", content).strip()
    return content


async def analyze_lab_image(base64_image: str, mime_type: str) -> dict:
    """Send data to Anthropic and parse the JSON response."""
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")
    if not anthropic_key:
        raise EnvironmentError("ANTHROPIC_API_KEY is required")

    client = Anthropic(api_key=anthropic_key)

    # Build payload according to the new schema
    messages = [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Please analyze these lab results."},
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": mime_type,
                        "data": base64_image,
                    },
                },
            ],
        }
    ]

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        system=MEDICTRANSLATE_SYSTEM_PROMPT,
        messages=messages,
        max_tokens=2048,
    )

    if not response or not response.content:
        raise RuntimeError("No response from Anthropic or response is empty")

    text_output = response.content[0].text

    cleaned = _strip_markdown_fences(text_output)

    try:
        insight_json = json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse JSON from AI response: {e}; response was: {cleaned}")

    if not isinstance(insight_json, dict):
        raise ValueError("AI response JSON is not an object")

    return insight_json
