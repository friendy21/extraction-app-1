"use client";

import React from 'react';
import { steps } from './steps'; // Import shared steps

interface StepIndicatorProps {
    currentStep: number; // 0 for Organization, 1 for Connection, 2 for Employees, 3 for Data, 4 for Anonymization, 5 for Review
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
    return (
        <div className="flex items-center justify-center space-x-4">
            {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                    <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-white ${
                            index < currentStep 
                                ? 'bg-green-500 border-green-500' // Completed steps
                                : index === currentStep 
                                    ? 'bg-blue-500 border-blue-500' // Current step
                                    : 'border-gray-300' // Incomplete steps
                        }`}
                    >
                        {index < currentStep ? '✓' : index + 1} {/* Show checkmark for completed steps */}
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                        index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                        {step.name}
                    </span>
                    {index < steps.length - 1 && (
                        <div className="h-1 w-14 bg-gray-300 ml-2"></div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default StepIndicator;
