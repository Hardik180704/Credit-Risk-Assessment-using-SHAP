export type LoanApplicationPayload = {
  person_age: number;
  person_income: number;
  person_home_ownership: string;
  person_emp_length: number;
  loan_intent: string;
  loan_grade: string;
  loan_amnt: number;
  loan_int_rate: number;
  loan_percent_income: number;
  cb_person_default_on_file: string;
  cb_person_cred_hist_length: number;
};

export type PredictionResponse = {
  default_probability: number;
  default_prediction: number;
  threshold: number;
  Result: string;
};

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://localhost:8000";

export async function predictLoan(
  payload: LoanApplicationPayload
): Promise<PredictionResponse> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      `Could not reach the prediction API at ${API_URL}. Make sure the FastAPI backend is running.`
    );
  }

  if (!res.ok) {
    let message = `API request failed with status ${res.status}`;
    try {
      const body = await res.json();
      if (typeof body?.detail === "string") {
        message = body.detail;
      } else if (Array.isArray(body?.detail)) {
        message = body.detail
          .map((d: { msg?: string }) => d?.msg ?? JSON.stringify(d))
          .join(", ");
      }
    } catch {
      // keep the status-code message
    }
    throw new Error(message);
  }

  return res.json();
}
