// ponytail: the browser axios chain (zustand persist + interceptors) deadlocks in
// the Next server runtime — RSC data fetching must use plain fetch.
// Mirror of the response unwrap in shared/api/axios.ts.
export async function serverGet<T>(
  path: string,
  timeoutMs = 5000,
): Promise<T | null> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "X-Api-Version": "1" },
    signal: AbortSignal.timeout(timeoutMs),
    cache: "no-store",
  }).catch(() => null);
  if (!res || !res.ok) return null;
  const body = await res.json().catch(() => null);
  if (!body || typeof body !== "object") return null;
  const rest =
    (body as { ok?: boolean }).ok === true
      ? (({ ok: _, ...r }) => r)(body as Record<string, unknown>)
      : body;
  const keys = Object.keys(rest);
  return (keys.length === 1 && keys[0] === "data" ? rest.data : rest) as T;
}
