// Base API Client
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("flosy_token");
}

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("flosy_token", token);
  }
}

export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("flosy_token");
    localStorage.removeItem("flosy_user");
  }
}

export function getUser() {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("flosy_user");
  return user ? JSON.parse(user) : null;
}

export function setUser(user: any) {
  if (typeof window !== "undefined") {
    localStorage.setItem("flosy_user", JSON.stringify(user));
  }
}

async function request(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401) {
      removeToken();
      if (typeof window !== "undefined" && !window.location.pathname.includes("/auth")) {
        window.location.href = "/auth/login";
      }
    }
    const errorMsg = data?.message || "حدث خطأ غير متوقع، برجاء المحاولة لاحقاً";
    const err = new Error(errorMsg) as any;
    err.errors = data?.errors;
    err.status = res.status;
    throw err;
  }

  return data;
}

// 🔐 Authentication API
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (res.data?.token) {
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res.data;
  },

  register: async (data: { name: string; email: string; password: string; password_confirmation: string }) => {
    const res = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.data?.token) {
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res.data;
  },

  logout: async () => {
    try {
      await request("/auth/logout", { method: "POST" });
    } finally {
      removeToken();
    }
  },
};

// 📊 Dashboard API
export const dashboardApi = {
  getSummary: async (month?: string) => {
    const query = month ? `?month=${month}` : "";
    const res = await request(`/dashboard${query}`);
    return res.data;
  },
};

// 💸 Expenses API
export const expenseApi = {
  getAll: async (filters?: { month?: string; category?: string; from?: string; to?: string }) => {
    const params = new URLSearchParams();
    if (filters?.month) params.append("month", filters.month);
    if (filters?.category) params.append("category", filters.category);
    if (filters?.from) params.append("from", filters.from);
    if (filters?.to) params.append("to", filters.to);

    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await request(`/expenses${query}`);
    return res.data;
  },

  create: async (data: {
    title: string;
    amount: number;
    category: string;
    date: string;
    description?: string;
  }) => {
    const res = await request("/expenses", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  delete: async (id: number) => {
    return await request(`/expenses/${id}`, { method: "DELETE" });
  },
};

// 📅 Installments API
export const installmentApi = {
  getAll: async (status?: string) => {
    const query = status ? `?status=${status}` : "";
    const res = await request(`/installments${query}`);
    return res.data;
  },

  create: async (data: {
    title: string;
    amount: number;
    type: "one_time" | "recurring";
    start_date: string;
    total_installments?: number;
    description?: string;
  }) => {
    const res = await request("/installments", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  markAsPaid: async (installmentId: number, paymentId: number) => {
    const res = await request(`/installments/${installmentId}/payments/${paymentId}/pay`, {
      method: "PATCH",
    });
    return res.data;
  },

  delete: async (id: number) => {
    return await request(`/installments/${id}`, { method: "DELETE" });
  },
};

// 👤 Profile API
export const profileApi = {
  get: async () => {
    const res = await request("/profile");
    return res.data;
  },

  update: async (data: { name?: string; salary_amount?: number; salary_day?: number }) => {
    const res = await request("/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    setUser(res.data);
    return res.data;
  },
};
