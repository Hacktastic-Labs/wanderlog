import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';
import { useAuthStore } from '@/stores/auth.store';

export type CreatePlanRequest = {
  title: string;
  description: string;
  visibility: string;
  status: string;
  start_date: string;
  end_date: string;
  estimated_cost: number;
};

export type CreatePlanResponse = {
  message: string;
};

class PlansApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = 'PlansApiError';
  }
}

export async function createPlan(payload: CreatePlanRequest): Promise<CreatePlanResponse> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.plans.create}`;
  const token = useAuthStore.getState().session?.accessToken;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = (await response.json()) as { message?: string; error?: string };
      message = body.message ?? body.error ?? message;
    } catch {
      // Ignore invalid JSON bodies.
    }
    throw new PlansApiError(message, response.status);
  }

  return response.json() as Promise<CreatePlanResponse>;
}
