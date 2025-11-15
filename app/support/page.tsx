import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Support Center | zetuTech - Customer Help & Technical Support",
  description: "Get help from zetuTech support team. Contact us via email, phone, or live chat for technical support, order assistance, and product queries in Tanzania.",
  keywords: [
    "customer support",
    "technical support",
    "help desk",
    "contact zetuTech",
    "Tanzania tech support",
    "laptop support",
    "electronics help",
    "customer service",
    "product assistance",
    "order support"
  ],
  openGraph: {
    title: "Support Center | zetuTech - Customer Help & Technical Support",
    description: "Get immediate assistance from zetuTech support team via email, phone, or live chat for all your technical and order-related queries.",
    url: "https://zetutech.com/support",
    siteName: "zetuTech",
    type: "website",
    images: [
      {
        url: "/og-support.jpg",
        width: 1200,
        height: 630,
        alt: "zetuTech Support Center",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Support Center | zetuTech - Customer Help & Technical Support",
    description: "Contact zetuTech support for technical assistance, order help, and product queries in Tanzania.",
  },
};

export default function SupportPage() {
  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 ">
        {/* Header Section */}
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Support Center
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Need help? We&apos;re here to assist you with any issues or
            questions.
          </p>
        </header>

        {/* Contact Options */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
            <CardHeader>
              <Mail className="w-10 h-10 text-blue-500 mb-3" />
              <CardTitle>Email Support</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300">
              Reach out to our support team via email for general inquiries.
              <p className="mt-3 font-medium">support@zetutech.co.tz</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
            <CardHeader>
              <Phone className="w-10 h-10 text-green-500 mb-3" />
              <CardTitle>Phone Support</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300">
              Speak directly to our team for urgent issues or technical help.
              <p className="mt-3 font-medium">+255 XXX XXX XXX</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
            <CardHeader>
              <MessageSquare className="w-10 h-10 text-purple-500 mb-3" />
              <CardTitle>Live Chat</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300">
              Get real-time assistance through our in-app live chat feature.
              <p className="mt-3 font-medium">Available 9 AM - 9 PM (GMT+3)</p>
            </CardContent>
          </Card>
        </section>

        {/* FAQ Section */}
        <section >
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-800 dark:text-gray-200">
                    {item.question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 dark:text-gray-300">
                  {item.answer}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Support Form */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Submit a Support Request
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Can&apos;t find the answer you&apos;re looking for? Fill out the form below
            and our support team will get back to you within 24 hours.
          </p>

          <form className="space-y-6 max-w-2xl">
            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <Input
                type="text"
                placeholder="Enter your full name"
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300">
                Subject
              </label>
              <Input
                type="text"
                placeholder="Enter the subject of your request"
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300">
                Message
              </label>
              <Textarea
                placeholder="Describe your issue or question in detail..."
                className="w-full"
                rows={5}
                required
              />
            </div>

            <Button className="w-full md:w-auto">Submit Request</Button>
          </form>
        </section>
      </div>
    </div>
  );
}

const faqItems = [
  {
    question: "How do I reset my password?",
    answer:
      "To reset your password, go to the login page and click on 'Forgot Password.' Follow the instructions sent to your registered email address.",
  },
  {
    question: "How do I track my order?",
    answer:
      "You can track your order by navigating to the 'My Orders' section in your account. Order tracking details will be provided there.",
  },
  {
    question: "Can I update my delivery address after placing an order?",
    answer:
      "Yes, you can update your delivery address before the order is shipped by contacting our support team immediately.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept major payment methods, including mobile money, debit/credit cards, and direct bank transfers.",
  },
];