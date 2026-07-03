// ═══════════════════════════════════════════════════════════
//  Pharma Core — Paymob Client (server-side helper)
//  by Dr. Mazen Ashraf
//
//  NOTE: The primary Paymob integration lives in the Cloud
//  Functions (functions/src/index.ts: initiatePayment,
//  paymobCallback, verifyPayment). This client is provided as
//  a reusable helper if you want to call Paymob directly from
//  a Next.js API route instead of through Cloud Functions.
// ═══════════════════════════════════════════════════════════

const PAYMOB_BASE = "https://accept.paymob.com/api";

export interface BillingData {
  first_name: string;
  last_name:  string;
  email:      string;
  phone_number: string;
  apartment:  string;
  floor:      string;
  street:     string;
  building:   string;
  shipping_method: string;
  postal_code: string;
  city:       string;
  country:    string;
  state:      string;
}

export class PaymobClient {
  constructor(private apiKey: string) {}

  async getAuthToken(): Promise<string> {
    const res = await fetch(`${PAYMOB_BASE}/auth/tokens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: this.apiKey }),
    });
    const data = await res.json();
    if (!data.token) throw new Error("Failed to get Paymob auth token");
    return data.token;
  }

  async createOrder(params: {
    authToken: string;
    amountCents: number;
    currency: string;
    merchantOrderId: string;
  }) {
    const res = await fetch(`${PAYMOB_BASE}/ecommerce/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: params.authToken,
        delivery_needed: false,
        amount_cents: params.amountCents,
        currency: params.currency,
        merchant_order_id: params.merchantOrderId,
        items: [],
      }),
    });
    const data = await res.json();
    if (!data.id) throw new Error("Failed to create Paymob order");
    return data;
  }

  async getPaymentKey(params: {
    authToken: string;
    orderId: number;
    integrationId: string;
    amountCents: number;
    billingData: BillingData;
  }): Promise<string> {
    const res = await fetch(`${PAYMOB_BASE}/acceptance/payment_keys`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: params.authToken,
        amount_cents: params.amountCents,
        expiration: 3600,
        order_id: params.orderId,
        billing_data: params.billingData,
        currency: "EGP",
        integration_id: parseInt(params.integrationId),
      }),
    });
    const data = await res.json();
    if (!data.token) throw new Error("Failed to get payment key");
    return data.token;
  }

  buildIframeUrl(iframeId: string, paymentToken: string): string {
    return `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentToken}`;
  }
}
