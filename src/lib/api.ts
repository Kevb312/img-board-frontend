export const api = {
  async get<T = any>(path: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error(`GET ${path} failed`);
    return res.json() as Promise<T>;
  },

  async post<T = any>(path: string, body: any) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`POST ${path} failed`);
    return res.json() as Promise<T>;
  },

  async put<T = any>(path: string, body: any) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`PUT ${path} failed`);
    return res.json() as Promise<T>;
  },

  async delete<T = any>(path: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error(`DELETE ${path} failed`);
    return res.json() as Promise<T>;
  },

    async postForm<T = any>(path: string, formData: FormData, p0: { headers: { "Content-Type": string; }; }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error(`POST ${path} failed`);
    return res.json() as Promise<T>;
  },
};
