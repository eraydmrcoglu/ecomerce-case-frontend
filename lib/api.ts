export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://ecomerce-case-backend.onrender.com";

type ApiError = {
  message?: string;
  error?: string;
};

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
  }

  if (!res.ok) {
    const err = data as ApiError | null;
    const msg = err?.message || err?.error || "Unexpected error";
    throw new Error(msg);
  }

  return data as T;
}
