"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StepContextType {
    currentStep: number;
    setCurrentStep: (step: number) => void;
}

const StepContext = createContext<StepContextType | undefined>(undefined);

interface StepProviderProps {
    children: ReactNode;
    initialStep?: number;
}

export const StepProvider: React.FC<StepProviderProps> = ({ 
    children, 
    initialStep = 0  
}) => {
    const [currentStep, setCurrentStep] = useState(initialStep);

    return (
        <StepContext.Provider value={{ currentStep, setCurrentStep }}>
            {children}
        </StepContext.Provider>
    );
};

export const useStep = () => {
    const context = useContext(StepContext);
    if (!context) {
        throw new Error('useStep must be used within a StepProvider');
    }
    return context;
};