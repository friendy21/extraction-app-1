"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Employee } from '../../../lib/types';
import { employeeService } from '../../../lib/services/employeeService';

interface AddEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEmployeeAdded: () => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose, onEmployeeAdded }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<'manual' | 'csv'>('manual');
    const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
        name: '',
        email: '',
        department: '',
        position: '',
        location: '',
        workModel: '',
        status: 'Included',
        age: undefined,
        gender: '',
        ethnicity: '',
        timeZone: '',
        language: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [hasChanges, setHasChanges] = useState(false);

    // Close modal on outside click - FIXED HERE
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Only close if clicking outside the modal content
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                handleCloseModal();
            }
        };
        
        // Add event listener only to the background overlay, not the entire document
        const modalBackground = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
        if (isOpen && modalBackground) {
            modalBackground.addEventListener('mousedown', handleClickOutside);
            return () => {
                modalBackground.removeEventListener('mousedown', handleClickOutside);
            };
        }
        
        return () => {};
    }, [isOpen, hasChanges]);

    // Close modal on ESC key
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') handleCloseModal();
        };
        if (isOpen) document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, hasChanges]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewEmployee(prev => ({ ...prev, [name]: value }));
        setHasChanges(true);
        
        // Clear error for this field if it exists
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleCloseModal = () => {
        if (hasChanges) {
            if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
                onClose();
            }
        } else {
            onClose();
        }
    };

    const validateForm = () => {
        const validationErrors: { [key: string]: string } = {};
        if (!newEmployee.name?.trim()) validationErrors.name = 'Name is required';
        if (!newEmployee.email?.trim()) {
            validationErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(newEmployee.email)) {
            validationErrors.email = 'Email is invalid';
        }
        if (!newEmployee.department) validationErrors.department = 'Department is required';
        if (!newEmployee.position?.trim()) validationErrors.position = 'Position is required';
        return validationErrors;
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        setIsSubmitting(true);

        try {
            await employeeService.addEmployee({
                ...newEmployee,
                status: newEmployee.status as 'Included' | 'Excluded'
            } as Employee);
            onEmployeeAdded();
            onClose();
        } catch (error) {
            console.error("Error adding employee:", error);
            setErrors({ submit: 'Failed to add employee. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Handle CSV file upload
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                // Process CSV data
                console.log("CSV file loaded, processing...");
                // Implement CSV parsing logic here
                setHasChanges(true);
            }
        };
        reader.readAsText(file);
    };

    const downloadCSVTemplate = () => {
        const headers = "name,email,department,position,location,workModel,age,gender,ethnicity,timeZone,language,status";
        const blob = new Blob([headers], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'employee_template.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div
                ref={modalRef}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-xl animate-fadeIn overflow-y-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()} // Stop propagation to prevent closing when clicking inside
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Employee</h2>
                    <button
                        onClick={handleCloseModal}
                        type="button"
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {/* Tabs */}
                    <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            className={`pb-2 px-4 text-sm font-medium ${activeTab === 'manual'
                                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                            onClick={() => setActiveTab('manual')}
                        >
                            Manual Entry
                        </button>
                        <button
                            type="button"
                            className={`pb-2 px-4 text-sm font-medium ${activeTab === 'csv'
                                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                            onClick={() => setActiveTab('csv')}
                        >
                            CSV Upload
                        </button>
                    </div>

                    {/* Manual Entry Form */}
                    {activeTab === 'manual' && (
                        <form className="space-y-6">
                            {errors.submit && <p className="text-red-500 text-sm mb-4">{errors.submit}</p>}

                            {/* Personal Information */}
                            <div>
                                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">Personal Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            id="first-name"
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            onChange={(e) => {
                                                const lastName = newEmployee.name?.split(' ').slice(1).join(' ') || '';
                                                setNewEmployee(prev => ({
                                                    ...prev,
                                                    name: `${e.target.value} ${lastName}`.trim()
                                                }));
                                                setHasChanges(true);
                                                
                                                // Clear name error if it exists
                                                if (errors.name) {
                                                    setErrors(prev => {
                                                        const newErrors = {...prev};
                                                        delete newErrors.name;
                                                        return newErrors;
                                                    });
                                                }
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            id="last-name"
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            onChange={(e) => {
                                                const firstName = newEmployee.name?.split(' ')[0] || '';
                                                setNewEmployee(prev => ({
                                                    ...prev,
                                                    name: `${firstName} ${e.target.value}`.trim()
                                                }));
                                                setHasChanges(true);
                                                
                                                // Clear name error if it exists
                                                if (errors.name) {
                                                    setErrors(prev => {
                                                        const newErrors = {...prev};
                                                        delete newErrors.name;
                                                        return newErrors;
                                                    });
                                                }
                                            }}
                                        />
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={newEmployee.email}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            id="phone"
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Work Information */}
                            <div>
                                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">Work Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Department
                                        </label>
                                        <select
                                            name="department"
                                            id="department"
                                            value={newEmployee.department}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="">Select a department</option>
                                            <option value="Engineering">Engineering</option>
                                            <option value="Sales">Sales</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Finance">Finance</option>
                                            <option value="Product">Product</option>
                                            <option value="HR">HR</option>
                                            <option value="Customer Support">Customer Support</option>
                                            <option value="Legal">Legal</option>
                                        </select>
                                        {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Position
                                        </label>
                                        <input
                                            type="text"
                                            name="position"
                                            id="position"
                                            value={newEmployee.position}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        />
                                        {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Location
                                        </label>
                                        <select
                                            name="location"
                                            id="location"
                                            value={newEmployee.location}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="">Select a location</option>
                                            <option value="New York City">New York City</option>
                                            <option value="San Francisco">San Francisco</option>
                                            <option value="Austin">Austin</option>
                                            <option value="Chicago">Chicago</option>
                                            <option value="London">London</option>
                                            <option value="Berlin">Berlin</option>
                                            <option value="Singapore">Singapore</option>
                                            <option value="Tokyo">Tokyo</option>
                                            <option value="Sydney">Sydney</option>
                                            <option value="Toronto">Toronto</option>
                                            <option value="Remote">Remote</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="work-model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Work Model
                                        </label>
                                        <select
                                            name="workModel"
                                            id="work-model"
                                            value={newEmployee.workModel}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="">Select a work model</option>
                                            <option value="Remote">Remote</option>
                                            <option value="In-office">In-office</option>
                                            <option value="Hybrid (1 day in office)">Hybrid (1 day in office)</option>
                                            <option value="Hybrid (2 days in office)">Hybrid (2 days in office)</option>
                                            <option value="Hybrid (3 days in office)">Hybrid (3 days in office)</option>
                                            <option value="Hybrid (4 days in office)">Hybrid (4 days in office)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Demographic Information */}
                            <div>
                                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">Demographic Information</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">This information helps analyze workplace patterns. All data is anonymized.</p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Age
                                        </label>
                                        <input
                                            type="number"
                                            name="age"
                                            id="age"
                                            min="18"
                                            max="100"
                                            value={newEmployee.age || ''}
                                            onChange={(e) => {
                                                setNewEmployee(prev => ({ 
                                                    ...prev, 
                                                    age: e.target.value ? parseInt(e.target.value) : undefined 
                                                }));
                                                setHasChanges(true);
                                            }}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Gender
                                        </label>
                                        <select
                                            name="gender"
                                            id="gender"
                                            value={newEmployee.gender}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="">Select gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Non-binary">Non-binary</option>
                                            <option value="Other">Other</option>
                                            <option value="Prefer not to say">Prefer not to say</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="ethnicity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Race/Ethnicity
                                        </label>
                                        <select
                                            name="ethnicity"
                                            id="ethnicity"
                                            value={newEmployee.ethnicity}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="">Select ethnicity</option>
                                            <option value="Asian">Asian</option>
                                            <option value="Black">Black</option>
                                            <option value="Hispanic">Hispanic</option>
                                            <option value="Native American">Native American</option>
                                            <option value="Pacific Islander">Pacific Islander</option>
                                            <option value="White">White</option>
                                            <option value="Multiple">Multiple</option>
                                            <option value="Other">Other</option>
                                            <option value="Prefer not to say">Prefer not to say</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Primary Language
                                        </label>
                                        <input
                                            type="text"
                                            name="language"
                                            id="language"
                                            placeholder="e.g., English, Spanish, Mandarin"
                                            value={newEmployee.language}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="timeZone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Time Zone
                                        </label>
                                        <select
                                            name="timeZone"
                                            id="timeZone"
                                            value={newEmployee.timeZone}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="">Select time zone</option>
                                            <option value="Pacific Time (PT)">Pacific Time (PT)</option>
                                            <option value="Mountain Time (MT)">Mountain Time (MT)</option>
                                            <option value="Central Time (CT)">Central Time (CT)</option>
                                            <option value="Eastern Time (ET)">Eastern Time (ET)</option>
                                            <option value="GMT">GMT</option>
                                            <option value="CET">CET</option>
                                            <option value="IST">IST</option>
                                            <option value="JST">JST</option>
                                            <option value="AEST">AEST</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Analysis Inclusion */}
                            <div className="mt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-base font-medium text-gray-900 dark:text-white">Analysis Inclusion</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Choose whether to include this employee's data in workplace analysis</p>
                                    </div>
                                    <div className="flex items-center">
                                        <span className={`mr-2 ${newEmployee.status === 'Excluded' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>Exclude</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={newEmployee.status === 'Included'}
                                                onChange={() => {
                                                    setNewEmployee(prev => ({
                                                        ...prev,
                                                        status: prev.status === 'Included' ? 'Excluded' : 'Included'
                                                    }));
                                                    setHasChanges(true);
                                                }}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                        <span className={`ml-2 ${newEmployee.status === 'Included' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>Include</span>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* CSV Upload */}
                    {activeTab === 'csv' && (
                        <div className="space-y-6">
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                                <div className="mb-4">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                    </svg>
                                </div>
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Drag and drop your CSV file here</h4>
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">or click to browse</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".csv"
                                    id="csv-upload"
                                    onChange={handleFileUpload}
                                />
                                <button
                                    onClick={() => document.getElementById('csv-upload')?.click()}
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Browse Files
                                </button>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">CSV Template Guide</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Your CSV should have the following columns:</p>
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 text-xs font-mono">
                                    name,email,department,position,location,workModel,age,gender,ethnicity,timeZone,language,status
                                </div>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    onClick={downloadCSVTemplate}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-blue-600 bg-transparent hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Download Template
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end space-x-2">
                    <button
                        onClick={handleCloseModal}
                        type="button"
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">
                        Cancel
                    </button>
                    {activeTab === 'manual' && (
                        <button
                            onClick={handleSubmit}
                            type="button"
                            disabled={isSubmitting}
                            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Employee'}
                        </button>
                    )}
                    {activeTab === 'csv' && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                if (hasChanges) {
                                    // Handle CSV upload submission
                                    alert("CSV upload functionality would be implemented here.");
                                    onEmployeeAdded();
                                    onClose();
                                } else {
                                    alert("Please select a CSV file first.");
                                }
                            }}
                            type="button"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Upload CSV
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddEmployeeModal;