export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-primary-dark sm:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted">Last updated: July 30, 2026</p>

      <div className="mt-10 space-y-6 text-sm leading-relaxed text-gray-600">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-primary-dark">1. Information We Collect</h2>
          <p>When you place an order or create an account on budgetpay.store, we collect:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Your name, email address, phone number, and shipping address.</li>
            <li>Order details — items purchased, amounts, and payment method.</li>
            <li>Payment information is handled entirely by Razorpay; we never store your card details, UPI IDs, or bank account numbers.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-primary-dark">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Process and fulfil your orders — payment verification, shipping updates, and customer support.</li>
            <li>Send order-related communications only (confirmation, dispatch, delivery).</li>
            <li>Improve our products and website experience.</li>
            <li>We do <strong>not</strong> sell, rent, or share your personal data with third parties for their marketing.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-primary-dark">3. Payment Security</h2>
          <p>All payments are processed through Razorpay, a PCI-DSS compliant payment gateway. Your payment details are encrypted and transmitted directly to Razorpay — we never see or store them. Razorpay&apos;s privacy policy applies to the payment step.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-primary-dark">4. Data Retention</h2>
          <p>We retain your order and account information only as long as needed to fulfil orders and comply with legal obligations. You may request deletion of your account data at any time by contacting us.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-primary-dark">5. Cookies</h2>
          <p>We use essential cookies for cart functionality and authentication. No third-party tracking cookies are used. You can disable cookies in your browser, but some features may not work correctly.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-primary-dark">6. Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal data at any time. Email us at <a href="mailto:support@budgetpay.store" className="text-primary hover:underline">support@budgetpay.store</a> and we will respond within 7 days.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-primary-dark">7. Contact</h2>
          <p>For privacy-related queries: <a href="mailto:support@budgetpay.store" className="text-primary hover:underline">support@budgetpay.store</a></p>
        </section>
      </div>
    </div>
  )
}
