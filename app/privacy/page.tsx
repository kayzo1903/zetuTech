import PrivacyPolicyContent from "@/components/privacy";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            At ZetuTech, we are committed to protecting your privacy and ensuring the security of your personal information.
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
          <PrivacyPolicyContent />
        </div>

        <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
    </div>
  );
}