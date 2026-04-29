export type CreateChargeInput = {
  orderId: string;
  amountThb: number;
  email: string;
  returnUrl?: string;
};

export async function createCharge(input: CreateChargeInput) {
  const secretKey = process.env.OMISE_SECRET_KEY;

  if (!secretKey) {
    return createMockCharge(input);
  }

  const sourceBody = new URLSearchParams({
    amount: String(input.amountThb * 100),
    currency: "thb",
    type: "promptpay"
  });

  const authHeader = `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`;
  const sourceResponse = await fetch("https://api.omise.co/sources", {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: sourceBody
  });

  if (!sourceResponse.ok) {
    const errorText = await sourceResponse.text();
    throw new Error(`Omise source failed: ${errorText}`);
  }

  const source = (await sourceResponse.json()) as { id: string };
  const body = new URLSearchParams({
    amount: String(input.amountThb * 100),
    currency: "thb",
    source: source.id,
    description: `WebBeatTH order ${input.orderId}`,
    return_uri: input.returnUrl ?? `/checkout/success?order=${input.orderId}`
  });

  body.set("metadata[order_id]", input.orderId);
  body.set("metadata[email]", input.email);

  const response = await fetch("https://api.omise.co/charges", {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Omise charge failed: ${errorText}`);
  }

  const charge = (await response.json()) as {
    id: string;
    status: string;
    amount: number;
    currency: string;
    authorize_uri?: string;
  };

  return {
    id: charge.id,
    status: charge.status,
    amount: charge.amount,
    currency: charge.currency,
    authorizeUri: charge.authorize_uri ?? `/checkout/success?order=${input.orderId}`,
    email: input.email
  };
}

export async function createMockCharge(input: CreateChargeInput) {
  return {
    id: `chrg_mock_${input.orderId}`,
    status: "successful",
    amount: input.amountThb * 100,
    currency: "thb",
    authorizeUri: `/checkout/success?order=${input.orderId}&mock=1`,
    email: input.email
  };
}
