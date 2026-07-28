import { Resend } from "resend"

export function getResend() {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendOrderConfirmation(order: {
  customerEmail: string
  customerName: string
  amountPaise: number
}) {
  const resend = getResend()
  if (!resend) return

  await resend.emails.send({
    from: "budgetpay.store <orders@budgetpay.store>",
    to: order.customerEmail,
    subject: "Order Confirmed — budgetpay.store",
    html: `<h1>Thank you, ${order.customerName}!</h1>
<p>Your order has been confirmed.</p>
<p>Amount: ₹${(order.amountPaise / 100).toLocaleString("en-IN")}</p>
<p>We'll send a shipping update once your furniture is on its way.</p>
<p>— budgetpay.store team</p>`,
  })
}