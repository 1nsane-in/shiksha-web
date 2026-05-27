export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "response" in err) {
    const axiosErr = err as { response?: { data?: { message?: string | string[] } } };
    const msg = axiosErr.response?.data?.message;
    if (Array.isArray(msg)) return msg[0] || fallback;
    if (typeof msg === "string") return msg;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

