export type CreateChargeInput = {
  orderId: string;
  amountThb: number;
  email: string;
};

export async function createMockCharge(input: CreateChargeInput) {
  return {
    id: `chrg_mock_${input.orderId}`,
    status: "pending",
    amount: input.amountThb * 100,
    currency: "thb",
    authorizeUri: `/checkout/success?order=${input.orderId}&mock=1`,
    email: input.email
  };
}
