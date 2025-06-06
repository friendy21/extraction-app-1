"use client";

import { useState, useEffect, useMemo } from "react";

interface AnonymizationResultProps {
  onRunAgain?: () => void;
}

export default function AnonymizationResult({ onRunAgain }: AnonymizationResultProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Data for the result summary
  const resultData = useMemo(() => ({
    employees: 242,
    emails: 78432,
    chatMessages: 121548,
    meetings: 10762,
    fileAccesses: 43684
  }), []);

  // Animate the numbers counting up
  const [counts, setCounts] = useState({
    employees: 0,
    emails: 0,
    chatMessages: 0,
    meetings: 0,
    fileAccesses: 0
  });

  useEffect(() => {
    // Make the component visible with a slight delay for better UX
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Animate the counts increasing over time
    const duration = 2000; // 2 seconds
    const steps = 20;
    const interval = duration / steps;

    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setCounts({
        employees: Math.floor(resultData.employees * progress),
        emails: Math.floor(resultData.emails * progress),
        chatMessages: Math.floor(resultData.chatMessages * progress),
        meetings: Math.floor(resultData.meetings * progress),
        fileAccesses: Math.floor(resultData.fileAccesses * progress)
      });

      if (step === steps) {
        clearInterval(timer);
        // Set final values
        setCounts(resultData);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible, resultData]);

  if (!isVisible) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 h-64 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center text-green-600 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span className="font-medium">
          Anonymization complete! All personal identifiable information has been secured.
        </span>
      </div>

      <div className="bg-gray-50 p-6 rounded mb-6">
        <h3 className="text-lg font-medium mb-4">Anonymization Summary</h3>
        <ul className="space-y-3">
          <li className="flex items-center text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">{counts.employees} employees</span>{" "}
            <span className="text-green-600 ml-1">anonymized</span>
          </li>
          <li className="flex items-center text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">{counts.emails.toLocaleString()} emails</span>{" "}
            <span className="ml-1">processed</span>
          </li>
          <li className="flex items-center text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">{counts.chatMessages.toLocaleString()} chat messages</span>{" "}
            <span className="text-green-600 ml-1">anonymized</span>
          </li>
          <li className="flex items-center text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">{counts.meetings.toLocaleString()} meetings</span>{" "}
            <span className="ml-1">processed</span>
          </li>
          <li className="flex items-center text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">{counts.fileAccesses.toLocaleString()} file accesses</span>{" "}
            <span className="text-green-600 ml-1">anonymized</span>
          </li>
        </ul>

        <div className="mt-6 bg-blue-50 p-4 rounded">
          <h4 className="text-blue-700 font-medium mb-2">Privacy Assurance</h4>
          <p className="text-gray-700">
            All personal identifiable information has been anonymized. The Glynac analysis engine will only process anonymized data to ensure employee privacy.
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={onRunAgain}
        >
          Run Anonymization
        </button>
      </div>
    </div>
  );
}