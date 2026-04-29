type SendOrderEmailInput = {
  email: string;
  orderNumber: string;
};

export async function sendOrderEmail(input: SendOrderEmailInput) {
  if (!process.env.RESEND_API_KEY) {
    return { skipped: true, reason: "RESEND_API_KEY is not configured", input };
  }

  return { skipped: true, reason: "Email template integration is pending", input };
}
