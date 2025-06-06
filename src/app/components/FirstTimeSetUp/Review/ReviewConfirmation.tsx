"use client"

import React, { useState } from 'react';
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { AlertCircle, ChevronLeft, CheckCircle } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useStep } from '../StepContext';

const ReviewConfirmationPage: React.FC = () => {
    const router = useRouter();
    const { setCurrentStep } = useStep();
    const [isDeploying, setIsDeploying] = useState(false);
    
    const [checkboxes, setCheckboxes] = useState({
        employeeNotification: false,
        organizationApproval: false,
        appropriateUse: false
    });

    const handleCheckboxChange = (name: string) => {
        setCheckboxes({
            ...checkboxes,
            [name]: !checkboxes[name as keyof typeof checkboxes]
        });
    };

    const handlePrevious = () => {
        setCurrentStep(4); 
        router.push('/components/FirstTimeSetUp/Anonymization');
    };

    const handleCompleteSetup = () => {
        setIsDeploying(true);
        // Simulate deployment
        setTimeout(() => {
            setIsDeploying(false);
            router.push('/components/Dashboard');
        }, 2000);
    };

    const allChecked = Object.values(checkboxes).every(value => value === true);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-extrabold mb-2 text-[#2563EB]">Review & Confirmation</h1>
            <p className="text-gray-600 mb-6">Review your setup and confirm to deploy to the Glynac analysis engine.</p>

            {/* Setup Summary Section */}
            <Card className="shadow rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Setup Summary</h2>
                
                <div className="mb-6">
                    <h3 className="font-semibold mb-2">Connected Data Sources</h3>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <span>Microsoft 365</span>
                        </div>
                        <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <span>Google Workspace</span>
                        </div>
                        <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <span>Slack</span>
                        </div>
                        <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <span>Zoom</span>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="font-semibold mb-4">Employee Data</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4 flex items-center">
                            <div className="bg-blue-100 rounded-full p-2 mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">Total Employees</div>
                                <div className="text-2xl font-bold">248</div>
                            </div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 flex items-center">
                            <div className="bg-green-100 rounded-full p-2 mr-3">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">Included in Analysis</div>
                                <div className="text-2xl font-bold text-green-600">242</div>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                            <div className="bg-gray-100 rounded-full p-2 mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">Excluded from Analysis</div>
                                <div className="text-2xl font-bold">6</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="font-semibold mb-4">Department Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span>Engineering</span>
                                <span>67 employees</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '27%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span>Sales</span>
                                <span>54 employees</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '22%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span>Marketing</span>
                                <span>32 employees</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '13%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span>Finance</span>
                                <span>28 employees</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '11%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span>Product</span>
                                <span>26 employees</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span>Customer Support</span>
                                <span>15 employees</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '6%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span>HR</span>
                                <span>12 employees</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '5%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span>Legal</span>
                                <span>8 employees</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '3%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Data Collection Section */}
            <Card className="shadow rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Data Collection</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex justify-between items-center border-b pb-3">
                        <span className="text-gray-700">Emails:</span>
                        <span className="font-semibold text-lg">78,432</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-3">
                        <span className="text-gray-700">Meetings:</span>
                        <span className="font-semibold text-lg">10,762</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-3">
                        <span className="text-gray-700">Chat Messages:</span>
                        <span className="font-semibold text-lg">121,548</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-3">
                        <span className="text-gray-700">File Accesses:</span>
                        <span className="font-semibold text-lg">43,684</span>
                    </div>
                </div>
            </Card>

            {/* Anonymization Section */}
            <Card className="shadow rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Anonymization</h2>
                <div className="flex items-start mb-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                        <div className="font-semibold">All PII successfully anonymized</div>
                        <p className="text-gray-600 text-sm">
                            Employee names, email addresses, and other personal identifiers have been replaced with anonymous IDs to ensure privacy during analysis.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Data Usage Confirmation Section */}
            <Card className="shadow rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Data Usage Confirmation</h2>
                <p className="text-gray-600 mb-4">Please confirm the following statements before proceeding with analysis:</p>
                
                <div className="space-y-4">
                    <div className="flex items-start">
                        <input 
                            type="checkbox" 
                            id="employeeNotification" 
                            className="mt-1 mr-3"
                            checked={checkboxes.employeeNotification}
                            onChange={() => handleCheckboxChange('employeeNotification')}
                        />
                        <div>
                            <label htmlFor="employeeNotification" className="font-semibold cursor-pointer">Employee Notification</label>
                            <p className="text-gray-600 text-sm">
                                I confirm that employees have been informed that their workplace communication data will be analyzed for improving collaboration and team dynamics.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <input 
                            type="checkbox" 
                            id="organizationApproval" 
                            className="mt-1 mr-3"
                            checked={checkboxes.organizationApproval}
                            onChange={() => handleCheckboxChange('organizationApproval')}
                        />
                        <div>
                            <label htmlFor="organizationApproval" className="font-semibold cursor-pointer">Organization Approval</label>
                            <p className="text-gray-600 text-sm">
                                I confirm that I have the necessary authorization from my organization to collect and analyze workplace communication data.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <input 
                            type="checkbox" 
                            id="appropriateUse" 
                            className="mt-1 mr-3"
                            checked={checkboxes.appropriateUse}
                            onChange={() => handleCheckboxChange('appropriateUse')}
                        />
                        <div>
                            <label htmlFor="appropriateUse" className="font-semibold cursor-pointer">Appropriate Use</label>
                            <p className="text-gray-600 text-sm">
                                I confirm that the analysis results will be used solely for the purpose of improving workplace collaboration, employee well-being, and organizational effectiveness.
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Complete Setup Section */}
            <Card className="shadow rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">Complete Setup</h2>
                        <p className="text-gray-600">Ready to deploy to the Glynac analysis engine?</p>
                    </div>
                    <div className="flex space-x-3">
                        <Button 
                            onClick={handlePrevious}
                            className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded hover:bg-gray-50"
                        >
                            Previous
                        </Button>
                        <Button 
                            onClick={handleCompleteSetup}
                            disabled={!allChecked || isDeploying}
                            className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center ${!allChecked || isDeploying ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isDeploying ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Deploying...
                                </>
                            ) : 'Complete Setup'}
                        </Button>
                    </div>
                </div>
                {!allChecked && (
                    <div className="mt-4 text-amber-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span className="text-sm">Please confirm all statements above to proceed</span>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ReviewConfirmationPage;