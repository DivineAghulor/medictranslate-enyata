"use server";

import {
  AnalyzeLabFileError,
  AnalyzeLabFileSuccess,
  LabInsight,
} from "@/types/analysis";

export type AnalyzeLabFileResult = AnalyzeLabFileSuccess | AnalyzeLabFileError;

const BACKEND_BASE_URL = process.env.NEXT_BACKEND_URL;
const ANALYZE_ENDPOINT = `${BACKEND_BASE_URL}/analyze`;
const MAX_FILE_BYTES = 2_097_152;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png"]);

function normalizeInsight(input: unknown): LabInsight {
  const value = (input ?? {}) as Record<string, unknown>;

  const toArray = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
  const toString = (v: unknown): string => (typeof v === "string" ? v : "");

  return {
    disclaimer: toString(value.disclaimer),
    big_picture: toString(value.big_picture),
    good_results: toArray(value.good_results),
    areas_of_attention: toArray(value.areas_of_attention),
    next_steps: toString(value.next_steps),
  };
}

function normalizeErrorMessage(status: number, payload: unknown): string {
  if (
    payload &&
    typeof payload === "object" &&
    "detail" in (payload as Record<string, unknown>)
  ) {
    const detail = (payload as Record<string, unknown>).detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) return detail.map(String).join(", ");
  }

  if (status === 413) return "File too large. Maximum allowed size is 2MB.";
  if (status === 400)
    return "Invalid file type. Only JPEG and PNG are supported.";
  if (status === 422)
    return "Unable to process this lab file. Please try another image.";
  if (status >= 500)
    return "Server error while analyzing file. Please try again.";
  return "Failed to analyze file.";
}

export async function analyzeLabFile(
  file: File,
): Promise<AnalyzeLabFileResult> {
  if (!file) {
    return { ok: false, status: 400, message: "No file provided." };
  }

  if (file.size > MAX_FILE_BYTES) {
    return {
      ok: false,
      status: 413,
      message: "File too large. Maximum allowed size is 2MB.",
    };
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return {
      ok: false,
      status: 400,
      message: "Invalid file type. Only JPEG and PNG are supported.",
    };
  }

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(ANALYZE_ENDPOINT, {
      method: "POST",
      body: formData,
      cache: "no-store",
    });

    let payload: unknown = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: normalizeErrorMessage(response.status, payload),
      };
    }

    return {
      ok: true,
      data: normalizeInsight(payload),
    };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Network error while connecting to analysis service.",
    };
  }
}
