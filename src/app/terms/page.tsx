export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-primary-dark sm:text-4xl">Terms &amp; Conditions</h1>
      <p className="mt-2 text-sm text-muted">Last updated: July 30, 2026</p>

      <div className="mt-10 space-y-6 text-sm leading-relaxed text-gray-600">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-primary-dark">1. General</h2>
          <p>By placing an order on budgetpay.store, you agree to these terms. If you do not agree, please do not use the site.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-primary-dark">2. Products &amp; Descriptions</h2>
          <p>Some items in our catalog are refurbished — cleaned, repaired, and restored pre-owned pieces, clearly marked with our "Refurbished" tag. Other items are new. Each piece is unique; minor variations in colour, grain, and finish are natural and expected. Photos are taken under controlled lighting and may differ slightly from the actual item.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-primary-dark">3. Pricing &amp; Payments</h2>
          <p>All prices are in INR and include applicable taxes. Payment is due at checkout via Razorpay (UPI, Cards, NetBanking, or Wallet). Once payment is confirmed, your order enters processing.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-primary-dark">4. Order Confirmation</h2>
          <p>After placing an order, you will receive a confirmation email with an order ID. If you do not receive one within 15 minutes, please check your spam folder or contact support.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-primary-dark">5. Shipping &amp; Delivery</h2>
          <p>Orders are typically dispatched within 5–7 business days after the final polish step. Delivery timelines vary by location. We ship across India. You will receive a tracking update once dispatched.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-primary-dark">6. Returns &amp; Refunds</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>If an item arrives damaged or significantly different from its description, notify us within 48 hours of delivery at <a href="mailto:support@budgetpay.store" className="text-primary hover:underline">support@budgetpay.store</a> with photos.</li>
            <li>We will arrange a pickup and issue a full refund (including original shipping) within 7 business days after the item is received.</li>
            <li>Change-of-mind returns are accepted within 3 days of delivery. The item must be unused and in original condition. Return shipping is borne by the buyer, and a 10% restocking fee applies.</li>
            <li>Refunds are processed to the original payment method via Razorpay.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-primary-dark">7. Cancellation</h2>
          <p>Orders can be cancelled within 1 hour of placement at no charge. After that, cancellation is at our discretion and may incur a processing fee if the item has already entered the polishing or packing stage.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-primary-dark">8. Limitation of Liability</h2>
          <p>budgetpay.store is not liable for indirect damages arising from use of the products. Our total liability is limited to the purchase price of the item in question.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-primary-dark">9. Changes</h2>
          <p>We may update these terms at any time. Continued use of the site after changes constitutes acceptance of the new terms.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-primary-dark">10. Contact</h2>
          <p>Email: <a href="mailto:support@budgetpay.store" className="text-primary hover:underline">support@budgetpay.store</a></p>
        </section>
      </div>
    </div>
  )
}
