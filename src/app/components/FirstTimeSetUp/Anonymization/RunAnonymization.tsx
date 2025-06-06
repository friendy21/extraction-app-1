"use client";

interface RunAnonymizationProps {
  onRunAnonymization?: () => void;
  isProcessing?: boolean;
}

export default function RunAnonymization({
  onRunAnonymization,
  isProcessing = false,
}: RunAnonymizationProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Run Anonymization</h2>
          <p className="text-gray-600">
            Start the anonymization process for all collected data.
          </p>
        </div>
        <button
          onClick={onRunAnonymization}
          disabled={isProcessing}
          className={`px-4 py-2 rounded text-white ${
            isProcessing 
              ? "bg-blue-300 cursor-not-allowed" 
              : "bg-blue-500 hover:bg-blue-600 transition"
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            "Run Anonymization"
          )}
        </button>
      </div>
    </div>
  );
}