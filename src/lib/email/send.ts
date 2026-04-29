type SendOrderEmailInput = {
  email: string;
  orderNumber: string;
  orderId?: string;
  downloadUrl?: string;
};

export async function sendOrderEmail(input: SendOrderEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    return { skipped: true, reason: "RESEND_API_KEY or EMAIL_FROM is not configured", input };
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const orderUrl = input.orderId ? `/checkout/success?order=${input.orderId}` : "/library";

  return resend.emails.send({
    from,
    to: input.email,
    subject: `WebBeatTH order ${input.orderNumber}`,
    html: `
      <h1>ขอบคุณสำหรับออเดอร์ ${input.orderNumber}</h1>
      <p>ระบบบันทึกการชำระเงินสำเร็จแล้ว คุณสามารถเข้าสู่ My Library เพื่อดาวน์โหลดไฟล์และ license ได้</p>
      <p><a href="${input.downloadUrl ?? orderUrl}">เปิดออเดอร์ / My Library</a></p>
    `
  });
}
