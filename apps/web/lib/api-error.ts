export function getApiErrorMessage(err: unknown, fallback: string = "Something went wrong. Please try again."): string {
  if (err && typeof err === "object" && "response" in err) {
    const axiosErr = err as { response?: { status?: number; data?: { message?: string | string[]; error?: { message?: string; code?: string } } } };
    const status = axiosErr.response?.status;
    const data = axiosErr.response?.data;

    // Handle { error: { message, code } } format
    if (data?.error?.message) return data.error.message;

    // Handle { message } format
    const msg = data?.message;
    if (Array.isArray(msg)) return msg[0] || fallback;
    if (typeof msg === "string") return msg;

    // Status-based fallbacks
    if (status === 429) return "Too many requests. Please wait a moment and try again.";
    if (status === 401) return "Your session has expired. Please sign in again.";
    if (status === 403) return "You don't have permission to perform this action.";
    if (status === 404) return "The requested resource was not found.";
    if (status === 409) return "This action conflicts with an existing record.";
    if (status && status >= 500) return "Our servers are having trouble. Please try again shortly.";
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
