export default function ShippingPage() {
  return (
    <main
      className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 
      dark:from-slate-900 dark:via-slate-950 dark:to-black 
      py-10 px-4"
    >
      <div className="min-h-screen p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Shipping Information</h1>

        <section className="mb-8 space-y-4">
          <h2 className="text-xl font-semibold">Delivery Options</h2>
          <p className="text-base">
            We offer fast and reliable delivery across all regions. Choose your
            preferred shipping method at checkout.
          </p>
          <ul className="list-disc pl-6 text-base space-y-2">
            <li>Dar es Salaam: Free Delivery within 24 hours</li>
            <li>
              Other Regions: Delivery within 2-5 business days (depending on
              distance), fee TZS 15,000
            </li>
            <li>You will be informed of the pickup point in advance</li>
            <li>Standard Delivery (2-5 business days)</li>
            <li>Express Delivery (1-2 business days)</li>
            <li>Same-Day Delivery (Selected cities only)</li>
          </ul>
        </section>

        <section className="mb-8 space-y-4">
          <h2 className="text-xl font-semibold">Shipping Costs</h2>
          <p className="text-base">
            Shipping fees vary depending on your location and delivery method.
            The exact fee will be calculated at checkout.
          </p>
        </section>

        <section className="mb-8 space-y-4">
          <h2 className="text-xl font-semibold">Order Tracking</h2>
          <p className="text-base">
            Once your order is shipped, you will receive a tracking number via
            email or SMS. Use it to monitor your delivery status in real time.
          </p>
        </section>

        <section className="mb-8 space-y-4">
          <h2 className="text-xl font-semibold">International Shipping</h2>
          <p className="text-base">
            We ship to selected international destinations. Delivery times and
            fees may vary by country.
          </p>
        </section>

        <section className="mb-8 space-y-4">
          <h2 className="text-xl font-semibold">Support</h2>
          <p className="text-base">
            If you have questions about shipping, contact our support team at
            support@zetutech.co.tz or call +255 700 000 000.
          </p>
        </section>
      </div>
    </main>
  );
}