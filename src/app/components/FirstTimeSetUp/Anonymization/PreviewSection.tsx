"use client";

import { useState, useEffect } from "react";
import EmailPreview from "./previews/EmailPreview";
import ChatPreview from "./previews/ChatPreview";

interface PreviewSectionProps {
  viewState: "button-only" | "expanded";
  onShowPreview?: () => void;
}

export default function PreviewSection({ 
  viewState, 
  onShowPreview 
}: PreviewSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (viewState === "expanded") {
      // Fake a brief loading state when expanding preview
      if (isLoading) {
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, viewState]);

  const handleShowPreview = () => {
    setIsLoading(true);
    if (onShowPreview) {
      onShowPreview();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Preview Anonymization</h2>
        {viewState === "button-only" && (
          <button
            onClick={handleShowPreview}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Show Preview
          </button>
        )}
      </div>
      <p className="text-gray-600 mb-4">
        See how your data will look after anonymization.
      </p>

      {viewState === "expanded" && (
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <EmailPreview />
              <ChatPreview />
            </>
          )}
        </div>
      )}
    </div>
  );
}