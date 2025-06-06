"use client"; // Mark as a client component
import React from 'react';
import Link from 'next/link';
import StepIndicator from './StepIndicator';
import { useStep } from './StepContext';

const MenuBar: React.FC = () => {
    const { currentStep } = useStep();
    

    return (
        <div>
            {/* Top header with Glynac Admin Setup */}
                <div className="container mx-auto px-4">
                    <div className="flex items-center">
                        <Link href="/" className={`text-xl font-bold`}>
                            Glynac
                        </Link>
                        <span className={`ml-2 text-base`}>
                            Admin Setup
                        </span>
                    </div>
                </div>
            
            {/* Main navigation bar below */}
            <div className={`border-b `}>
                <div className="container mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        <div className="w-32">
                        </div>
                        <StepIndicator currentStep={currentStep} />
                        <div className="w-32">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuBar;
