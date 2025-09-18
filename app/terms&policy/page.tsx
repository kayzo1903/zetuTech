export default function TermsPage() {
  const sections = [
    {
      number: "1",
      title: "Payment Policy",
      description:
        "At ZetuTech, we provide multiple secure and convenient payment options to enhance your shopping experience.",
      content: (
        <>
          {/* Payment Methods */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl mb-6">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-4">
              Available Payment Methods:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  label: "Cash on Delivery",
                  short: "COD",
                  color: "green",
                  description: "Pay when you receive your order",
                },
                {
                  label: "M-Pesa Mobile Money",
                  short: "M-Pesa",
                  color: "purple",
                  description: "Instant payment via mobile",
                },
                {
                  label: "Tigo Pesa",
                  short: "Tigo Pesa",
                  color: "orange",
                  description: "Mobile money transfer",
                },
                {
                  label: "Airtel Money",
                  short: "Airtel",
                  color: "red",
                  description: "Secure mobile payments",
                },
              ].map((method, idx) => (
                <div
                  key={idx}
                  className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div
                    className={`bg-${method.color}-100 dark:bg-${method.color}-900/30 p-2 rounded-lg mr-4`}
                  >
                    <span
                      className={`text-${method.color}-800 dark:text-${method.color}-300 font-semibold`}
                    >
                      {method.short}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {method.label}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {method.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Notes */}
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
            <li>
              For Cash on Delivery, payment is made directly to our delivery team at the time of delivery.
            </li>
            <li>
              For mobile payments, you will receive payment instructions after order confirmation.
            </li>
            <li>
              Customers are encouraged to inspect their product before completing COD payments.
            </li>
            <li>
              Mobile money confirmations may take up to 1 hour to process during business hours.
            </li>
          </ul>
        </>
      ),
    },
    {
      number: "2",
      title: "Delivery Policy",
      description:
        "We manage all deliveries directly to ensure product quality and customer satisfaction.",
      content: (
        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
          <li>Delivery is available within Dar es Salaam and surrounding areas.</li>
          <li>Delivery times are scheduled with customers after order confirmation.</li>
          <li>Delivery fees may apply depending on location and will be communicated before dispatch.</li>
          <li>Customers must provide accurate delivery details to avoid delays.</li>
          <li>Same-day delivery is available for orders placed before 2:00 PM on business days.</li>
        </ul>
      ),
    },
    {
      number: "3",
      title: "Warranty Policy",
      description:
        "All laptops sold by ZetuTech are covered by a limited warranty. The warranty duration depends on the type of product purchased.",
      content: (
        <>
          {/* Warranty Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-xl border border-green-100 dark:border-green-800">
              <h3 className="font-semibold text-green-800 dark:text-green-300">
                Brand New Laptops
              </h3>
              <p className="text-green-700 dark:text-green-300 text-lg font-bold mt-2">
                1-Year Warranty
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Full manufacturer warranty
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300">
                Refurbished Laptops
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-lg font-bold mt-2">
                6-Month Warranty
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Comprehensive parts coverage
              </p>
            </div>
          </div>

          {/* Warranty Coverage */}
          <p className="text-gray-600 dark:text-gray-300">
            The warranty covers the following:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mt-2">
            <li>Motherboard and internal components</li>
            <li>Battery performance (normal degradation expected)</li>
            <li>Storage drives (HDD or SSD)</li>
            <li>RAM and other internal parts</li>
            <li>Screen defects (e.g., dead pixels, backlight issues)</li>
          </ul>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mt-6 border border-yellow-200 dark:border-yellow-800">
            <h3 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">
              Please Note:
            </h3>
            <p className="text-yellow-700 dark:text-yellow-300">
              The warranty does not cover physical damage, liquid damage, accidental drops, unauthorized repairs, or software-related issues.
            </p>
          </div>
        </>
      ),
    },
    {
      number: "4",
      title: "Returns & Refunds",
      description:
        "Our returns and refunds policy ensures customer satisfaction while preventing misuse.",
      content: (
        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
          <li>Customers must inspect the product before completing payment upon delivery.</li>
          <li>Returns are only accepted for defective products or incorrect orders.</li>
          <li>Claims must be reported within 48 hours of delivery with proof of purchase.</li>
          <li>Refunds are processed after inspection and verification of the returned product.</li>
          <li>Mobile money refunds are processed within 3-5 business days.</li>
          <li>COD refunds are processed via mobile money transfer.</li>
        </ul>
      ),
    },
    {
      number: "5",
      title: "Limitation of Liability",
      description:
        "ZetuTech shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products. Total liability is limited to the original purchase price.",
    },
    {
      number: "6",
      title: "Changes to These Terms",
      description:
        "ZetuTech reserves the right to modify these terms at any time. Changes will be communicated via our website and will take effect immediately.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-6 sm:px-10">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Terms & Conditions
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-lg">
            Please read these terms carefully before using our services.
          </p>
        </header>

        <div className="space-y-12">
          {sections.map((section, idx) => (
            <section
              key={idx}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h2 className="flex items-center text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-3">
                  {section.number}
                </span>
                {section.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {section.description}
              </p>
              {section.content}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
