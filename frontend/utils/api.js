const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000";

export async function fetcher(path, options) {
  const token =
    typeof window !== "undefined" ? window.localStorage.getItem("cc-token") : null;
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
      ...(options?.headers ?? {})
    }
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error ?? "Request failed");
  }

  return await response.json();
}
