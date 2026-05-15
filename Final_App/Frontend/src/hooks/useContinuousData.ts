import { useEffect, useState } from "react";

export function useContinuousData<T>(endpoint: string, initialData: T): T {
  const [data, setData] = useState<T>(initialData);

  useEffect(() => {
    // In actual dev/prod, configure base URL. Here localhost:8000 for FastAPI
    // Since vite might run on different port, hardcoding for now or using a relative one if proxied.
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
    const url = `${baseUrl}${endpoint}`;
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setData(parsed);
      } catch (err) {
        console.error("Failed to parse SSE data", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error(`SSE error on ${endpoint}`, err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [endpoint]);

  return data;
}
