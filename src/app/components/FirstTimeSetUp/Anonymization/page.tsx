"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AnonymizationInfo from "./AnonymizationInfo";
import PreviewSection from "./PreviewSection";
import RunAnonymization from "./RunAnonymization";
import AnonymizationResult from "./AnonymizationResult";

export default function AnonymizationPage() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<
    "info" | "preview" | "processing" | "result"
  >("info");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnonymizationComplete, setIsAnonymizationComplete] = useState(false);

  const handleShowPreview = () => {
    setCurrentView("preview");
  };

  const handleRunAnonymization = () => {
    setCurrentView("processing");
    setIsProcessing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentView("result");
      setIsAnonymizationComplete(true);
    }, 3000);
  };

  const handleRunAgain = () => {
    setCurrentView("processing");
    setIsProcessing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentView("result");
      setIsAnonymizationComplete(true);
    }, 3000);
  };

  const handlePrevious = () => {
    router.push('/components/FirstTimeSetUp/DataSetup');
  };

  const handleNext = () => {
    router.push('/components/FirstTimeSetUp/Review');
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">PII Anonymization</h1>
        <p className="text-gray-600">
          Protect employee privacy by anonymizing personal identifiable information.
        </p>
      </div>

      {/* Show different components based on the current view */}
      {currentView === "info" && (
        <>
          <AnonymizationInfo />
          <PreviewSection onShowPreview={handleShowPreview} viewState="button-only" />
          <RunAnonymization onRunAnonymization={handleRunAnonymization} />
        </>
      )}

      {currentView === "preview" && (
        <>
          <AnonymizationInfo />
          <PreviewSection viewState="expanded" />
          <RunAnonymization onRunAnonymization={handleRunAnonymization} />
        </>
      )}

      {currentView === "processing" && (
        <>
          <AnonymizationInfo />
          <PreviewSection viewState="expanded" />
          <RunAnonymization isProcessing={true} />
        </>
      )}

      {currentView === "result" && (
        <>
          <AnonymizationInfo />
          <PreviewSection viewState="expanded" />
          <AnonymizationResult onRunAgain={handleRunAgain} />
        </>
      )}

      <div className="flex justify-between mt-8">
        <button 
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition"
          onClick={handlePrevious}
        >
          Previous
        </button>
        <button 
          className={`px-4 py-2 rounded transition ${
            isAnonymizationComplete 
              ? "bg-blue-500 text-white hover:bg-blue-600" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={handleNext}
          disabled={!isAnonymizationComplete}
        >
          Next
        </button>
      </div>
    </div>
  );
}