import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';

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
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
