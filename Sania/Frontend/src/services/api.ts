/**
 * API service layer placeholder.
 * Later swap fetchJson with a real client (Databricks, FastAPI, etc.).
 */
export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
}
