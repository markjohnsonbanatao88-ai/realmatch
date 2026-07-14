export type SupabaseRecord = Record<string, unknown>;

export class SupabaseRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "SupabaseRequestError";
  }
}

type RequestOptions = Omit<RequestInit, "headers" | "body"> & {
  headers?: HeadersInit;
  body?: unknown;
};

/** A small, dependency-free client for this app's Supabase REST/Auth calls. */
export class SupabaseHttpClient {
  constructor(
    private readonly url: string,
    private readonly apiKey: string,
    private readonly accessToken = apiKey
  ) {}

  private async request<T>(path: string, options: RequestOptions = {}) {
    const headers = new Headers(options.headers);
    headers.set("apikey", this.apiKey);
    headers.set("Authorization", `Bearer ${this.accessToken}`);
    headers.set("Accept", "application/json");
    if (options.body !== undefined) headers.set("Content-Type", "application/json");

    const response = await fetch(`${this.url}${path}`, {
      ...options,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: "no-store"
    });

    if (response.status === 204) return undefined as T;
    const payload = await response.json().catch(() => undefined);
    if (!response.ok) {
      const details = payload as { message?: string; msg?: string } | undefined;
      throw new SupabaseRequestError(
        details?.message || details?.msg || `Supabase request failed (${response.status}).`,
        response.status,
        payload
      );
    }
    return payload as T;
  }

  select<T>(table: string, query: string) {
    return this.request<T[]>(`/rest/v1/${table}?${query}`);
  }

  insert<T>(table: string, row: SupabaseRecord) {
    return this.request<T[]>(`/rest/v1/${table}`, {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: row
    });
  }

  update<T>(table: string, query: string, updates: SupabaseRecord) {
    return this.request<T[]>(`/rest/v1/${table}?${query}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: updates
    });
  }

  rpc<T>(name: string, args: SupabaseRecord) {
    return this.request<T>(`/rest/v1/rpc/${name}`, { method: "POST", body: args });
  }

  auth<T>(path: string, options: RequestOptions = {}) {
    return this.request<T>(`/auth/v1${path}`, options);
  }
}
