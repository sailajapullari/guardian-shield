const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function createOrder(amount: number) {
  const response = await fetch(`${API_BASE_URL}/api/create-order/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount }),
  });

  if (!response.ok) {
    throw new Error("Failed to create order");
  }

  return response.json() as Promise<{
    order_id: string;
    amount: number;
    currency: string;
    razorpay_key_id: string;
  }>;
}

export async function verifyPayment(payload: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  amount: number;
  user_email: string;
  location: string;
  device_used: string;
  time_spent: number;
}) {
  const response = await fetch(`${API_BASE_URL}/api/verify-payment/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail || "Payment verification failed");
  }

  return response.json();
}

export interface PaymentHistoryItem {
  user_email: string;
  order_id: string;
  payment_id: string | null;
  signature: string | null;
  amount: number;
  spending_range: string | null;
  location: string | null;
  device_used: string | null;
  time_spent: number | null;
  transaction_frequency: number;
  status: string;
  created_at: string;
}

export async function fetchPaymentHistory(
  userEmail: string,
): Promise<PaymentHistoryItem[]> {
  const params = new URLSearchParams({ user_email: userEmail });
  const response = await fetch(`${API_BASE_URL}/api/history/?${params.toString()}`);

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail || "Failed to load transaction history");
  }

  return response.json();
}

