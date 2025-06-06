"use client";

export default function AnonymizationInfo() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold mb-2">How Anonymization Works</h2>
      <p className="text-gray-600 mb-4">
        Glynac uses a secure anonymization process to protect employee privacy while maintaining data analysis integrity.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="text-lg font-medium text-blue-700 mb-2">1. Automatic Identity Protection</h3>
          <p className="text-sm text-gray-700">
            All names, email addresses, and other personally identifiable information are automatically replaced with anonymous IDs by the system.
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded">
          <h3 className="text-lg font-medium text-blue-700 mb-2">2. One-Click Anonymization</h3>
          <p className="text-sm text-gray-700">
            With a single action, you can trigger Glynac's powerful anonymization engine to process all collected data, ensuring complete employee privacy protection.
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded">
          <h3 className="text-lg font-medium text-blue-700 mb-2">3. Secure Analysis</h3>
          <p className="text-sm text-gray-700">
            The Glynac analysis engine only processes the anonymized data, ensuring complete employee privacy throughout all analysis phases.
          </p>
        </div>
      </div>
    </div>
  );
}