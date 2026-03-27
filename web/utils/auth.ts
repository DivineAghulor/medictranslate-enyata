const isAxiosErrorLike = (
  err: unknown,
): err is {
  isAxiosError: true;
  response?: { data?: unknown };
  message?: string;
} => {
  return Boolean(
    err &&
    typeof err === "object" &&
    "isAxiosError" in err &&
    (err as { isAxiosError?: unknown }).isAxiosError === true,
  );
};

export const normalizeAuthError = (err: unknown): string => {
  if (isAxiosErrorLike(err)) {
    const payload = err.response?.data as unknown;

    if (typeof payload === "string" && payload.trim()) return payload;

    if (payload && typeof payload === "object") {
      const record = payload as Record<string, unknown>;
      const message = record.message;
      if (typeof message === "string" && message.trim()) return message;

      const detail = record.detail;
      if (typeof detail === "string" && detail.trim()) return detail;
      if (Array.isArray(detail) && detail.length)
        return detail.map(String).join(", ");

      const error = record.error;
      if (typeof error === "string" && error.trim()) return error;
    }

    if (err.message) return err.message;
    return "Request failed.";
  }

  if (err instanceof Error && err.message) return err.message;
  return "Request failed.";
};
